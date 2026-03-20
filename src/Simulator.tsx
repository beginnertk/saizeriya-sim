import React, { useMemo, useState, useEffect } from "react";
import type { Item, Targets, SavedCombo, Restaurant } from "./types";

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
};

export default function Simulator({ restaurant, onBack }: Props) {
  // ストレージキーをレストランIDごとに分離（サイゼリヤと日高屋のデータが混ざらない）
  const KEY = `gaisyoku-sim-v1:${restaurant.id}`;

  const [items, setItems] = usePersistentState<Item[]>(`${KEY}:items`, restaurant.items);
  const [qty, setQty] = usePersistentState<Record<string, number>>(`${KEY}:qty`, {});
  const [targets, setTargets] = usePersistentState<Targets>(
    `${KEY}:targets`,
    restaurant.defaultTargets
  );
  const [query, setQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saves, setSaves] = usePersistentState<SavedCombo[]>(`${KEY}:saves`, []);
  const [saveName, setSaveName] = useState<string>(() => new Date().toLocaleString("ja-JP"));

  // 数量操作
  const getQty = (id: string) => Math.max(0, qty[id] || 0);
  const setItemQty = (id: string, n: number) => {
    const v = Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
    setQty((prev) => ({ ...prev, [id]: v }));
  };
  const addOne = (id: string) => setItemQty(id, getQty(id) + 1);
  const subOne = (id: string) => setItemQty(id, Math.max(0, getQty(id) - 1));

  // 集計
  const totals = useMemo(() => computeTotals(items, qty), [items, qty]);

  // 予算判定
  const budgetOk =
    targets.budget === undefined ? true : totals.price <= targets.budget;
  const overAmount = targets.budget !== undefined ? totals.price - targets.budget : 0;

  // 検索フィルター
  const filtered = useMemo(() => simpleFilter(items, query), [items, query]);

  // JSONエクスポート（メニュー定義）
  const exportJson = () => {
    const payload = { items, targets };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurant.id}_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSONインポート（メニュー定義）
  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.targets) setTargets(parsed.targets);
      } catch (e) {
        alert("JSONの読み込みに失敗しました\n" + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

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

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
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
          <div className="flex gap-2 text-sm">
            <button
              className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700 transition"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "編集を閉じる" : "メニュー編集"}
            </button>
            <label className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700 transition cursor-pointer">
              JSON読込
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files && importJson(e.target.files[0])}
              />
            </label>
            <button
              className="rounded-xl bg-neutral-800 px-3 py-1.5 hover:bg-neutral-700 transition"
              onClick={exportJson}
            >
              JSON書出
            </button>
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

            <div className="mt-3 flex gap-2 text-xs">
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
            <div className="mt-2 flex gap-2 text-xs">
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

            {/* 保存一覧 */}
            <div className="mt-3 max-h-44 space-y-2 overflow-auto pr-1">
              {saves.length === 0 ? (
                <div className="text-xs text-neutral-500">保存データはありません</div>
              ) : (
                [...saves].reverse().map((s) => {
                  const preview = computeTotals(items, s.qty);
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
                            {yen(preview.price)} / {preview.count} 品
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
                })
              )}
            </div>
          </div>
        </section>

        {/* メニュー一覧 */}
        <section className="mt-6">
          {restaurant.categories.map((cat) => {
            const group = filtered.filter((it) => it.category === cat);
            if (!group.length) return null;
            return (
              <div key={cat} className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{cat}</h3>
                  <div className="flex gap-2 text-xs">
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
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((it) => {
                    const q = getQty(it.id);
                    const isOn = q > 0;
                    return (
                      <div
                        key={it.id}
                        className={`rounded-2xl border p-3 transition ${
                          isOn
                            ? "border-emerald-500/60 bg-emerald-950/20"
                            : "border-neutral-800 bg-neutral-900/30"
                        }`}
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

                        {/* 数量ステッパー */}
                        <div className="mt-2 flex items-center gap-2">
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
            );
          })}
        </section>

        {/* JSON編集エリア */}
        {editMode && (
          <section className="mt-6 rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">メニュー編集（JSON）</h2>
            <p className="mb-2 text-sm text-neutral-400">
              id は一意に、price は数値で入力してください。category はカテゴリ名と一致させてください。
            </p>
            <JsonEditor items={items} setItems={setItems} />
          </section>
        )}

        <footer className="mt-10 border-t border-neutral-900 pt-4 text-xs text-neutral-500">
          ※ このツールは個人用です。価格は変動することがあります。最新情報は各店舗の公式サイトをご確認ください。
        </footer>
      </div>
    </div>
  );
}

// ============================================================
// JSONエディターコンポーネント（サブ）
// ============================================================

function JsonEditor({
  items,
  setItems,
}: {
  items: Item[];
  setItems: (v: Item[]) => void;
}) {
  const [text, setText] = useState(JSON.stringify(items, null, 2));

  useEffect(() => {
    setText(JSON.stringify(items, null, 2));
  }, [items]);

  const tryApply = () => {
    try {
      const next = JSON.parse(text);
      if (!Array.isArray(next)) throw new Error("配列ではありません");
      next.forEach((it: Item, i: number) => {
        if (!it.id) throw new Error(`${i + 1} 行目: id がありません`);
        if (!it.name) throw new Error(`${i + 1} 行目: name がありません`);
        if (!it.category) throw new Error(`${i + 1} 行目: category がありません`);
        if (typeof it.price !== "number") throw new Error(`${i + 1} 行目: price が数値ではありません`);
      });
      setItems(next);
      alert("更新しました");
    } catch (e) {
      alert("JSONエラー: " + (e as Error).message);
    }
  };

  const addTemplate = () => {
    const tpl: Item = {
      id: `item_${Date.now()}`,
      name: "新規メニュー",
      category: "未分類",
      price: 500,
      tags: [],
    };
    try {
      const current = JSON.parse(text);
      setText(JSON.stringify([...current, tpl], null, 2));
    } catch {
      setText(JSON.stringify([tpl], null, 2));
    }
  };

  return (
    <div>
      <div className="mb-2 flex gap-2 text-xs">
        <button
          className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700 transition"
          onClick={addTemplate}
        >
          行を追加
        </button>
        <button
          className="rounded-xl bg-emerald-700 px-3 py-1 hover:bg-emerald-600 transition"
          onClick={tryApply}
        >
          JSONを適用
        </button>
      </div>
      <textarea
        className="h-80 w-full rounded-lg bg-neutral-950 p-3 font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

