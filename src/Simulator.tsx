import React, { useMemo, useState, useEffect } from "react";
import type { Item, Targets, SavedCombo, Restaurant, SetTableConfig } from "./types";

// ============================================================
// ヘルパー関数（純関数 = 状態を持たない計算機）
// ============================================================

const yen = (n: number) =>
  n.toLocaleString("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

function computeTotals(items: Item[], qty: Record<string, number>) {
  const getQty = (id: string) => Math.max(0, qty[id] || 0);
  return {
    count: sum(items.map((it) => getQty(it.id))),
    price: sum(items.map((it) => it.price * getQty(it.id))),
  };
}

function simpleFilter(items: Item[], q: string) {
  const key = q.trim().toLowerCase();
  if (!key) return items;
  return items.filter((it) =>
    [it.name, it.category, ...(it.tags || [])].join(" ").toLowerCase().includes(key)
  );
}

function createSavedCombo(
  name: string,
  qty: Record<string, number>,
  targets?: Targets
): SavedCombo {
  const compactQty = Object.fromEntries(
    Object.entries(qty)
      .filter(([, v]) => (v || 0) > 0)
      .map(([k, v]) => [k, Math.max(0, Math.floor(v || 0))])
  );
  return {
    id: `save_${Date.now()}`,
    name: name.trim() || new Date().toLocaleString("ja-JP"),
    createdAt: Date.now(),
    qty: compactQty,
    targets,
  };
}

function validateSavedCombo(s: unknown): s is SavedCombo {
  if (!s || typeof s !== "object") return false;
  const obj = s as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.createdAt === "number" &&
    obj.qty !== null &&
    typeof obj.qty === "object"
  );
}

// ============================================================
// カスタムフック：localStorage に自動保存するステート
// ============================================================

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// ============================================================
// メインコンポーネント
// ============================================================

const MAX_SAVES = 50;

type Props = {
  restaurant: Restaurant;
  onBack: () => void;
  initialQty?: Record<string, number> | null;
};

export default function Simulator({ restaurant, onBack, initialQty }: Props) {
  // ストレージキーをレストランIDごとに分離（サイゼリヤと日高屋のデータが混ざらない）
  const KEY = `gaisyoku-sim-v3:${restaurant.id}`;

  // ── すべての useState / usePersistentState をここにまとめる ──
  const items = restaurant.items;
  const [qty, setQty] = usePersistentState<Record<string, number>>(`${KEY}:qty`, {});
  const [targets, setTargets] = usePersistentState<Targets>(
    `${KEY}:targets`,
    restaurant.defaultTargets
  );
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(restaurant.categories)
  );
  const [saves, setSaves] = usePersistentState<SavedCombo[]>(`${KEY}:saves`, []);
  const [saveName, setSaveName] = useState<string>(() => new Date().toLocaleString("ja-JP"));
  const [showOrderList, setShowOrderList] = useState(false);
  const [showSaveList, setShowSaveList] = useState(false);
  const [saveSearch, setSaveSearch] = useState("");
  const [saveSort, setSaveSort] = useState<"date" | "price-asc" | "price-desc">("date");
  const [copied, setCopied] = useState(false);

  // ── すべての useMemo をここにまとめる ──
  const totals = useMemo(() => computeTotals(items, qty), [items, qty]);
  const selectedItems = useMemo(
    () => items.filter((it) => (qty[it.id] || 0) > 0),
    [items, qty]
  );
  const filtered = useMemo(() => simpleFilter(items, query), [items, query]);

  // ── すべての useEffect をここにまとめる ──

  // URLシェアから開いた場合、共有された数量を適用
  useEffect(() => {
    if (initialQty) setQty(initialQty);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 1品でも選んだら自動でドロワーを開く
  useEffect(() => {
    if (totals.count > 0) setShowOrderList(true);
  }, [totals.count]);

  // ── 関数定義 ──

  const toggleCategory = (cat: string) =>
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });

  // 数量操作
  const getQty = (id: string) => Math.max(0, qty[id] || 0);
  const setItemQty = (id: string, n: number) => {
    const v = Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
    setQty((prev) => ({ ...prev, [id]: v }));
  };
  const addOne = (id: string) => setItemQty(id, getQty(id) + 1);
  const subOne = (id: string) => setItemQty(id, Math.max(0, getQty(id) - 1));

  // 予算判定
  const budgetOk =
    targets.budget === undefined ? true : totals.price <= targets.budget;
  const overAmount = targets.budget !== undefined ? totals.price - targets.budget : 0;

  // 保存
  const saveCurrent = () => {
    const saved = createSavedCombo(saveName, qty, targets);
    setSaves((prev) => [...prev.slice(-(MAX_SAVES - 1)), saved]);
    setSaveName(new Date().toLocaleString("ja-JP"));
  };

  const loadSave = (s: SavedCombo) => {
    setQty({ ...s.qty });
    if (s.targets) setTargets({ ...s.targets });
  };

  const deleteSave = (id: string) => {
    setSaves((prev) => prev.filter((s) => s.id !== id));
  };

  const exportSaves = () => {
    const blob = new Blob([JSON.stringify(saves, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurant.id}_saves_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSaves = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("配列ではありません");
        const valid = parsed.filter((s: unknown) => validateSavedCombo(s));
        setSaves((prev) => [...prev, ...valid].slice(-MAX_SAVES));
      } catch (e) {
        alert("保存データの読み込みに失敗しました\n" + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // ランダム選定
  const randomUnderBudget = () => {
    const budget = targets.budget ?? 1000;
    const pool = [...items].sort(() => Math.random() - 0.5);
    const next: Record<string, number> = {};
    let cost = 0;
    for (const it of pool) {
      if (cost + it.price <= budget && Math.random() > 0.4) {
        next[it.id] = (next[it.id] || 0) + 1;
        cost += it.price;
      }
    }
    setQty(next);
  };

  const reset = () => setQty({});

  // URLシェア：選択状態をURLハッシュに埋め込んでクリップボードにコピー
  const shareUrl = () => {
    const compact = Object.entries(qty)
      .filter(([, v]) => (v || 0) > 0)
      .map(([id, v]) => `${id}:${v}`)
      .join(",");
    if (!compact) return;
    const base = window.location.href.split("#")[0];
    const url = `${base}#r=${restaurant.id}&q=${compact}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 pb-24">
      <div className="mx-auto max-w-6xl px-4 py-6">

        {/* ヘッダー */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700 transition"
              onClick={onBack}
            >
              ← 店舗選択
            </button>
            <div>
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-neutral-400">メニュー組み合わせシミュレーター</p>
            </div>
          </div>
        </header>

        {/* コントロールエリア */}
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* 合計サマリー */}
          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">合計</h2>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-neutral-400 text-sm">金額</span>
                <span
                  className={`text-2xl font-bold transition ${
                    budgetOk ? "text-white" : "text-red-400"
                  }`}
                >
                  {yen(totals.price)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-neutral-400 text-sm">品数</span>
                <span className="text-lg font-semibold">{totals.count} 品</span>
              </div>
            </div>

            {/* 予算インジケーター */}
            <div
              className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                budgetOk
                  ? "border-emerald-800 bg-emerald-950/40 text-emerald-300"
                  : "border-red-800 bg-red-950/40 text-red-300"
              }`}
            >
              {budgetOk
                ? `✓ 予算内（残り ${yen((targets.budget ?? 0) - totals.price)}）`
                : `✗ 予算オーバー（${yen(overAmount)} 超過）`}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                className="rounded-lg bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700 transition"
                onClick={reset}
              >
                数量クリア
              </button>
              <button
                className="rounded-lg bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700 transition"
                onClick={randomUnderBudget}
              >
                予算内ランダム
              </button>
              <button
                className={`rounded-lg px-3 py-1.5 transition ${
                  copied
                    ? "bg-emerald-700 text-white"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
                onClick={shareUrl}
                disabled={totals.count === 0}
              >
                {copied ? "コピーしました!" : "共有リンク生成"}
              </button>
            </div>
          </div>

          {/* 予算設定 + 検索 */}
          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">予算・検索</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="shrink-0 text-neutral-400">予算上限</span>
              <input
                type="number"
                className="w-full rounded-lg bg-neutral-900 px-3 py-1.5 text-right"
                value={targets.budget ?? ""}
                placeholder="例: 1000"
                onChange={(e) =>
                  setTargets({
                    ...targets,
                    budget: Number(e.target.value) || undefined,
                  })
                }
              />
              <span className="shrink-0 text-neutral-400">円</span>
            </div>

            <div className="mt-3">
              <input
                className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-500"
                placeholder="メニュー名・タグ・カテゴリで検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mt-3 text-xs text-neutral-500">
              表示中: {filtered.length} / {items.length} 品
            </div>
          </div>

          {/* 保存・プリセット */}
          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-3 text-lg font-semibold">保存・プリセット</h2>

            {/* 保存操作 */}
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                placeholder="保存名（例: いつもの）"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
              <button
                className="shrink-0 rounded-xl bg-emerald-700 px-3 py-2 text-sm hover:bg-emerald-600 transition"
                onClick={saveCurrent}
              >
                保存
              </button>
            </div>

            {/* 保存済み一覧（トグル開閉） */}
            <button
              className="mt-3 w-full flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700 transition"
              onClick={() => setShowSaveList((v) => !v)}
            >
              <span className="text-neutral-300">保存済み一覧（{saves.length}件）</span>
              <span className="text-neutral-500 text-xs">{showSaveList ? "▲ 閉じる" : "▼ 開く"}</span>
            </button>

            {showSaveList && (
              <div className="mt-2">
                {/* 検索 + 並べ替え */}
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs placeholder-neutral-500"
                    placeholder="保存名で検索..."
                    value={saveSearch}
                    onChange={(e) => setSaveSearch(e.target.value)}
                  />
                  <select
                    className="rounded-lg bg-neutral-900 px-2 py-1.5 text-xs text-neutral-300"
                    value={saveSort}
                    onChange={(e) => setSaveSort(e.target.value as typeof saveSort)}
                  >
                    <option value="date">新しい順</option>
                    <option value="price-asc">安い順</option>
                    <option value="price-desc">高い順</option>
                  </select>
                </div>

                {/* 一覧 */}
                <div className="max-h-60 space-y-2 overflow-auto pr-1">
                  {saves.length === 0 ? (
                    <div className="text-xs text-neutral-500 text-center py-3">保存データはありません</div>
                  ) : (() => {
                    const list = [...saves]
                      .map((s) => ({ ...s, _totals: computeTotals(items, s.qty) }))
                      .filter((s) =>
                        !saveSearch || s.name.toLowerCase().includes(saveSearch.toLowerCase())
                      )
                      .sort((a, b) => {
                        if (saveSort === "price-asc") return a._totals.price - b._totals.price;
                        if (saveSort === "price-desc") return b._totals.price - a._totals.price;
                        return b.createdAt - a.createdAt;
                      });
                    if (list.length === 0) {
                      return <div className="text-xs text-neutral-500 text-center py-3">該当なし</div>;
                    }
                    return list.map((s) => {
                      const missingCount = Object.keys(s.qty).filter(
                        (id) => !items.some((it) => it.id === id)
                      ).length;
                      return (
                        <div key={s.id} className="rounded-xl border border-neutral-800 p-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium">{s.name}</div>
                              <div className="text-[10px] text-neutral-500">
                                {new Date(s.createdAt).toLocaleString("ja-JP")}
                              </div>
                              <div className="text-[11px] text-neutral-400">
                                {yen(s._totals.price)} / {s._totals.count} 品
                              </div>
                              {missingCount > 0 && (
                                <div className="text-[10px] text-amber-400">
                                  ※ {missingCount} 品が現メニューに存在しません
                                </div>
                              )}
                            </div>
                            <div className="shrink-0 flex gap-1 text-xs">
                              <button
                                className="rounded bg-neutral-800 px-2 py-1 hover:bg-neutral-700 transition"
                                onClick={() => loadSave(s)}
                              >
                                読込
                              </button>
                              <button
                                className="rounded bg-neutral-800 px-2 py-1 hover:bg-neutral-700 transition"
                                onClick={() => deleteSave(s.id)}
                              >
                                削除
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* エクスポート / インポート（下部に小さく） */}
                <div className="mt-2 flex gap-2 text-xs border-t border-neutral-800 pt-2">
                  <button
                    className="rounded-lg bg-neutral-800 px-2 py-1 hover:bg-neutral-700 transition"
                    onClick={exportSaves}
                  >
                    エクスポート
                  </button>
                  <label className="rounded-lg bg-neutral-800 px-2 py-1 hover:bg-neutral-700 transition cursor-pointer">
                    インポート
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={(e) => e.target.files && importSaves(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* メニュー一覧 */}
        <section className="mt-6">
          {restaurant.categories.map((cat) => {
            const group = filtered.filter((it) => it.category === cat);
            const totalCount = restaurant.items.filter((it) => it.category === cat).length;
            if (!group.length && !totalCount) return null;
            const isOpen = openCategories.has(cat);
            const isSetTable = restaurant.setTable?.category === cat;
            return (
              <div key={cat} className="mb-4">
                {/* カテゴリヘッダー（クリックで折り畳み） */}
                <button
                  className="w-full mb-2 flex items-center justify-between rounded-xl bg-neutral-800 px-4 py-3 hover:bg-neutral-700 transition"
                  onClick={() => toggleCategory(cat)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">{cat}</span>
                    <span className="text-xs text-neutral-400">{totalCount}品</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {group.some((g) => getQty(g.id) > 0) && (
                      <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-medium">
                        {group.reduce((s, g) => s + getQty(g.id), 0)}点選択中
                      </span>
                    )}
                    <span className="text-neutral-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <>
                    {isSetTable && restaurant.setTable ? (
                      <SetTableGrid
                        config={restaurant.setTable}
                        group={group}
                        getQty={getQty}
                        addOne={addOne}
                        subOne={subOne}
                        setItemQty={setItemQty}
                        yen={yen}
                        qty={qty}
                        setQty={setQty}
                      />
                    ) : (
                      <>
                        <div className="mb-2 flex justify-end gap-2 text-xs">
                          <button
                            className="rounded-lg bg-neutral-900 px-2 py-1 hover:bg-neutral-800 transition"
                            onClick={() => {
                              const next = { ...qty };
                              group.forEach((g) => (next[g.id] = (next[g.id] || 0) + 1));
                              setQty(next);
                            }}
                          >
                            このカテゴリを+1
                          </button>
                          <button
                            className="rounded-lg bg-neutral-900 px-2 py-1 hover:bg-neutral-800 transition"
                            onClick={() => {
                              const next = { ...qty };
                              group.forEach((g) => (next[g.id] = 0));
                              setQty(next);
                            }}
                          >
                            解除
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {group.map((it) => {
                            const q = getQty(it.id);
                            const isOn = q > 0;
                            return (
                              <div
                                key={it.id}
                                className={`rounded-2xl border p-3 transition cursor-pointer ${
                                  isOn
                                    ? "border-emerald-500/60 bg-emerald-950/20"
                                    : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-600"
                                }`}
                                onClick={() => isOn ? setItemQty(it.id, 0) : addOne(it.id)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="font-medium text-sm leading-snug">{it.name}</div>
                                  <div className="shrink-0 text-sm font-semibold">{yen(it.price)}</div>
                                </div>
                                {it.tags && it.tags.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {it.tags.map((t) => (
                                      <span
                                        key={t}
                                        className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300"
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div
                                  className="mt-2 flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-base"
                                    onClick={() => subOne(it.id)}
                                    aria-label="減らす"
                                  >
                                    −
                                  </button>
                                  <input
                                    className="w-14 rounded-lg bg-neutral-900 px-2 py-1 text-center text-sm"
                                    type="number"
                                    min={0}
                                    value={q}
                                    onChange={(e) => setItemQty(it.id, Number(e.target.value))}
                                  />
                                  <button
                                    className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-base"
                                    onClick={() => addOne(it.id)}
                                    aria-label="増やす"
                                  >
                                    ＋
                                  </button>
                                  <div className="ml-auto text-xs text-neutral-400">
                                    小計: {yen(it.price * q)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </section>

        <footer className="mt-10 border-t border-neutral-900 pt-4 text-xs text-neutral-500">
          ※ このツールは個人用です。価格は変動することがあります。最新情報は各店舗の公式サイトをご確認ください。
        </footer>
      </div>

      {/* ========== 固定フッターバー ========== */}
      <div className="fixed bottom-0 left-0 right-0 z-50">

        {/* 選択リストドロワー（バーをタップすると展開） */}
        {showOrderList && (
          <div className="mx-auto max-w-6xl bg-neutral-900 border-t border-l border-r border-neutral-700 rounded-t-2xl max-h-72 overflow-y-auto">
            <div className="px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-300">選択中のメニュー</span>
                <button
                  className="text-xs text-neutral-500 hover:text-red-400 transition"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                >
                  全クリア
                </button>
              </div>
              {selectedItems.length === 0 ? (
                <div className="text-sm text-neutral-500 text-center py-4">
                  まだメニューを選んでいません
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((it) => {
                    const q = getQty(it.id);
                    return (
                      <div key={it.id} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-neutral-200">{it.name}</span>
                        <button
                          className="h-6 w-6 rounded bg-neutral-700 hover:bg-neutral-600 transition text-xs shrink-0"
                          onClick={(e) => { e.stopPropagation(); subOne(it.id); }}
                          aria-label="減らす"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs shrink-0">{q}</span>
                        <button
                          className="h-6 w-6 rounded bg-neutral-700 hover:bg-neutral-600 transition text-xs shrink-0"
                          onClick={(e) => { e.stopPropagation(); addOne(it.id); }}
                          aria-label="増やす"
                        >
                          ＋
                        </button>
                        <span className="text-xs font-semibold w-16 text-right shrink-0">
                          {yen(it.price * q)}
                        </span>
                        <button
                          className="text-neutral-600 hover:text-red-400 transition text-xs px-1 shrink-0"
                          onClick={(e) => { e.stopPropagation(); setItemQty(it.id, 0); }}
                          aria-label="削除"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* メインバー（常時表示） */}
        <div
          className="bg-neutral-900 border-t border-neutral-700 cursor-pointer hover:bg-neutral-800 transition select-none"
          onClick={() => setShowOrderList((v) => !v)}
        >
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {totals.count > 0 ? (
                <>
                  <span className="text-sm font-medium text-neutral-200">{totals.count} 品選択中</span>
                  <span className="text-xs text-neutral-500">{showOrderList ? "▼ 閉じる" : "▲ 一覧を見る"}</span>
                </>
              ) : (
                <span className="text-sm text-neutral-500">メニューを選んでください</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {targets.budget !== undefined && budgetOk && (
                <span className="text-xs text-emerald-400">
                  残り {yen(targets.budget - totals.price)}
                </span>
              )}
              {!budgetOk && (
                <span className="text-xs text-red-400">
                  {yen(overAmount)} オーバー
                </span>
              )}
              <span className={`text-xl font-bold ${budgetOk ? "text-white" : "text-red-400"}`}>
                {yen(totals.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// セット表形式コンポーネント
// ============================================================

function SetTableGrid({
  config,
  group,
  getQty,
  addOne,
  subOne,
  setItemQty,
  yen,
  qty,
  setQty,
}: {
  config: SetTableConfig;
  group: Item[];
  getQty: (id: string) => number;
  addOne: (id: string) => void;
  subOne: (id: string) => void;
  setItemQty: (id: string, n: number) => void;
  yen: (n: number) => string;
  qty: Record<string, number>;
  setQty: (v: Record<string, number> | ((p: Record<string, number>) => Record<string, number>)) => void;
}) {
  const lookup: Record<string, Record<string, Item>> = {};
  for (const it of group) {
    const colTag = config.colTags.find((ct) => it.tags?.includes(`ramen:${ct}`));
    const rowTag = config.rowTags.find((rt) => it.tags?.includes(`side:${rt}`));
    if (colTag && rowTag) {
      if (!lookup[colTag]) lookup[colTag] = {};
      lookup[colTag][rowTag] = it;
    }
  }

  const specialItems = group.filter((it) => it.tags?.includes("special"));

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full min-w-[600px] text-sm border-collapse">
          <thead>
            <tr className="bg-neutral-800">
              <th className="px-3 py-2 text-left text-xs text-neutral-400 font-normal border-b border-neutral-700 border-r border-neutral-700 w-40">
                サイド ╲ ラーメン
              </th>
              {config.cols.map((col) => (
                <th key={col} className="px-3 py-2 text-center text-xs font-semibold border-b border-neutral-700 border-r border-neutral-700 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {config.rows.map((row, ri) => (
              <tr key={row} className="border-b border-neutral-800 last:border-b-0">
                <td className="px-3 py-2 text-xs text-neutral-300 bg-neutral-800/50 border-r border-neutral-700 align-middle whitespace-nowrap">
                  {row}
                </td>
                {config.colTags.map((ct) => {
                  const it = lookup[ct]?.[config.rowTags[ri]];
                  if (!it) return (
                    <td key={ct} className="px-2 py-2 text-center text-neutral-600 border-r border-neutral-800 last:border-r-0">
                      —
                    </td>
                  );
                  const q = getQty(it.id);
                  const isOn = q > 0;
                  return (
                    <td
                      key={ct}
                      className={`px-2 py-2 border-r border-neutral-800 last:border-r-0 transition cursor-pointer ${
                        isOn ? "bg-emerald-950/30" : "hover:bg-neutral-800/50"
                      }`}
                      onClick={() => isOn ? setItemQty(it.id, 0) : addOne(it.id)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-semibold ${isOn ? "text-emerald-300" : "text-neutral-200"}`}>
                          {yen(it.price)}
                        </span>
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="h-6 w-6 rounded bg-neutral-700 hover:bg-neutral-600 transition text-xs"
                            onClick={() => subOne(it.id)}
                            aria-label="減らす"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-xs">{q}</span>
                          <button
                            className="h-6 w-6 rounded bg-neutral-700 hover:bg-neutral-600 transition text-xs"
                            onClick={() => addOne(it.id)}
                            aria-label="増やす"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          className="rounded-lg bg-neutral-900 px-2 py-1 text-xs hover:bg-neutral-800 transition"
          onClick={() => {
            const next = { ...qty };
            group.forEach((g) => (next[g.id] = 0));
            setQty(next);
          }}
        >
          セットを全て解除
        </button>
      </div>

      {specialItems.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs text-neutral-400">単独セット</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specialItems.map((it) => {
              const q = getQty(it.id);
              const isOn = q > 0;
              return (
                <div
                  key={it.id}
                  className={`rounded-2xl border p-3 transition cursor-pointer ${
                    isOn
                      ? "border-emerald-500/60 bg-emerald-950/20"
                      : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-600"
                  }`}
                  onClick={() => isOn ? setItemQty(it.id, 0) : addOne(it.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm leading-snug">{it.name}</div>
                    <div className="shrink-0 text-sm font-semibold">{yen(it.price)}</div>
                  </div>
                  <div
                    className="mt-2 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-base"
                      onClick={() => subOne(it.id)}
                      aria-label="減らす"
                    >
                      −
                    </button>
                    <input
                      className="w-14 rounded-lg bg-neutral-900 px-2 py-1 text-center text-sm"
                      type="number"
                      min={0}
                      value={q}
                      onChange={(e) => setItemQty(it.id, Number(e.target.value))}
                    />
                    <button
                      className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-base"
                      onClick={() => addOne(it.id)}
                      aria-label="増やす"
                    >
                      ＋
                    </button>
                    <div className="ml-auto text-xs text-neutral-400">
                      小計: {yen(it.price * q)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
