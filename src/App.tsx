import React, { useMemo, useState, useEffect } from "react";

// --- Types ---
type Category =
  | "主食"
  | "おかず"
  | "サラダ/前菜"
  | "サイド"
  | "デザート"


type Item = {
  id: string;
  name: string;
  category: Category;
  price: number; // 円
  kcal?: number; // kcal
  protein?: number; // g
  fat?: number; // g
  carbs?: number; // g
  salt?: number; // g 食塩相当量
  tags?: string[];
};

type Targets = {
  budget?: number; // 円 上限
  maxKcal?: number; // kcal 上限
  minProtein?: number; // g 下限
  maxSalt?: number; // g 上限
};

type SavedCombo = {
  id: string;
  name: string;
  createdAt: number; // epoch ms
  qty: Record<string, number>;
  targets?: Targets;
};

// --- Helpers ---
const yen = (n: number | undefined) =>
  n === undefined
    ? "-"
    : n.toLocaleString("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
      });

const num = (n: number | undefined, unit = "") =>
  n === undefined ? "-" : `${n}${unit}`;

const byCategory = (items: Item[]) => {
  const m = new Map<Category, Item[]>();
  (items || []).forEach((it) => {
    const arr = m.get(it.category) || [];
    arr.push(it);
    m.set(it.category, arr);
  });
  return m;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// 合計計算（テスト用にも利用できる純関数）
function computeTotals(items: Item[], qty: Record<string, number>) {
  const getQty = (id: string) => Math.max(0, qty[id] || 0);
  const pick = (k: keyof Item) =>
    sum(items.map((it) => (typeof it[k] === "number" ? (it[k] as number) * getQty(it.id) : 0)));
  return {
    count: sum(items.map((it) => getQty(it.id))),
    price: pick("price"),
    kcal: pick("kcal"),
    protein: pick("protein"),
    fat: pick("fat"),
    carbs: pick("carbs"),
    salt: pick("salt"),
  };
}

// シンプル検索（テスト用の純関数）
function simpleFilter(items: Item[], q: string) {
  const key = q.trim().toLowerCase();
  if (!key) return items;
  return items.filter((it) =>
    [it.name, it.category, ...(it.tags || [])].join(" ").toLowerCase().includes(key)
  );
}

// 保存の純関数群（テストしやすいよう分離）
function createSavedCombo(name: string, qty: Record<string, number>, targets?: Targets): SavedCombo {
  const compactQty = Object.fromEntries(
    Object.entries(qty)
      .filter(([, v]) => (v || 0) > 0)
      .map(([k, v]) => [k, Math.max(0, Math.floor(v || 0))])
  );
  return {
    id: `save_${Date.now()}`,
    name: name && name.trim() ? name.trim() : new Date().toLocaleString("ja-JP"),
    createdAt: Date.now(),
    qty: compactQty,
    targets,
  };
}

function validateSavedCombo(s: any): s is SavedCombo {
  return (
    s && typeof s === "object" && typeof s.id === "string" && typeof s.name === "string" && typeof s.createdAt === "number" && s.qty && typeof s.qty === "object"
  );
}

// --- 初期メニュー（ダミー値）---
const defaultItems: Item[] = [
  // 主食
  {
    id: "milan_doria",
    name: "ミラノ風ドリア",
    category: "主食",
    price: 300,
    kcal: 500,
    protein: 13,
    fat: 18,
    carbs: 75,
    salt: 2.4,
    tags: ["定番"],
  },
  {
    id: "baked_cheese_milan",
    name: "焼きチーズミラノ風ドリア",
    category: "主食",
    price: 350,
    kcal: 620,
    protein: 16,
    fat: 24,
    carbs: 80,
    salt: 2.8,
    tags: ["チーズ"],
  },
  {
    id: "soft_egg_milan",
    name: "半熟卵のミラノ風ドリア",
    category: "主食",
    price: 350,
    kcal: 580,
    protein: 17,
    fat: 20,
    carbs: 78,
    salt: 2.7,
    tags: ["卵"],
  },
  {
    id: "carbonara_soft_egg",
    name: "カルボナーラ(トッピング半熟卵)",
    category: "主食",
    price: 500,
    kcal: 820,
    protein: 24,
    fat: 32,
    carbs: 98,
    salt: 3.6,
    tags: ["パスタ"],
  },
  {
    id: "spinach_mushroom_cream",
    name: "きのことほうれん草のクリームスパゲッティ",
    category: "主食",
    price: 600,
    kcal: 760,
    protein: 22,
    fat: 28,
    carbs: 94,
    salt: 3.4,
    tags: ["パスタ"],
  },
  {
    id: "bolognese",
    name: "ミートソースボロニア風",
    category: "主食",
    price: 400,
    kcal: 690,
    protein: 23,
    fat: 18,
    carbs: 102,
    salt: 3.2,
    tags: ["パスタ"],
  },
  {
    id: "margherita",
    name: "マルゲリータピザ",
    category: "主食",
    price: 400,
    kcal: 720,
    protein: 28,
    fat: 26,
    carbs: 92,
    salt: 4.1,
    tags: ["ピザ"],
  },
  {
    id: "veggie_mushroom_pizza",
    name: "野菜とキノコのピザ",
    category: "主食",
    price: 400,
    kcal: 680,
    protein: 25,
    fat: 24,
    carbs: 90,
    salt: 4.3,
    tags: ["ピザ", "野菜"],
  },
  {
    id: "cheese_focaccia",
    name: "チーズフォッカチオ",
    category: "主食",
    price: 250,
    kcal: 360,
    protein: 13,
    fat: 12,
    carbs: 46,
    salt: 1.9,
    tags: ["パン"],
  },
  {
    id: "garlic_focaccia",
    name: "ガーリックフォッカチオ",
    category: "主食",
    price: 200,
    kcal: 340,
    protein: 10,
    fat: 10,
    carbs: 48,
    salt: 1.8,
    tags: ["パン"],
  },

  // おかず
  {
    id: "spicy_chicken",
    name: "辛味チキン",
    category: "おかず",
    price: 300,
    kcal: 380,
    protein: 24,
    fat: 24,
    carbs: 14,
    salt: 2.2,
    tags: ["人気"],
  },
  {
    id: "diavola_chicken",
    name: "若鶏のディアボラ風",
    category: "おかず",
    price: 500,
    kcal: 560,
    protein: 35,
    fat: 30,
    carbs: 10,
    salt: 2.6,
    tags: ["肉", "スパイス"],
  },
  {
    id: "cheese_baked_chicken",
    name: "柔らかチキンのチーズ焼き",
    category: "おかず",
    price: 500,
    kcal: 600,
    protein: 33,
    fat: 34,
    carbs: 8,
    salt: 2.8,
    tags: ["肉", "チーズ"],
  },


  // サラダ/前菜
  {
    id: "ebi_salad",
    name: "小エビのサラダ",
    category: "サラダ/前菜",
    price: 350,
    kcal: 220,
    protein: 10,
    fat: 14,
    carbs: 12,
    salt: 1.9,
    tags: ["サラダ"],
  },
  {
    id: "spinach_saute",
    name: "ほうれん草のソテー",
    category: "サラダ/前菜",
    price: 200,
    kcal: 180,
    protein: 5,
    fat: 12,
    carbs: 10,
    salt: 1.1,
    tags: ["野菜"],
  },
  {
    id: "warm_green_peas",
    name: "柔らか青豆の温サラダ",
    category: "サラダ/前菜",
    price: 200,
    kcal: 220,
    protein: 9,
    fat: 8,
    carbs: 28,
    salt: 1.2,
    tags: ["野菜"],
  },
 


  // デザート
  {
    id: "tiramisu",
    name: "ティラミス",
    category: "デザート",
    price: 300,
    kcal: 280,
    protein: 5,
    fat: 16,
    carbs: 28,
    salt: 0.3,
    tags: ["スイーツ"],
  },
  {
    id: "truffle_ice",
    name: "トリフアイスクリーム",
    category: "デザート",
    price: 350,
    kcal: 210,
    protein: 4,
    fat: 12,
    carbs: 22,
    salt: 0.2,
    tags: ["スイーツ"],
  },

];

const STORAGE_KEY = "saizeriya-sim-v3"; // 保存機能追加に伴いキー更新
const MAX_SAVES = 50;

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

export default function SaizeriyaSimulator() {
  const [items, setItems] = usePersistentState<Item[]>(`${STORAGE_KEY}:items`, defaultItems);
  // id -> 数量
  const [qty, setQty] = usePersistentState<Record<string, number>>(`${STORAGE_KEY}:qty`, {});
  const [targets, setTargets] = usePersistentState<Targets>(
    `${STORAGE_KEY}:targets`,
    { budget: 1000, maxKcal: 900, minProtein: 20, maxSalt: 6 }
  );
  const [query, setQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showOnlyViolations, setShowOnlyViolations] = useState(false);

  // 保存関連
  const [saves, setSaves] = usePersistentState<SavedCombo[]>(`${STORAGE_KEY}:saves`, []);
  const [saveName, setSaveName] = useState<string>(() => new Date().toLocaleString("ja-JP"));

  const getQty = (id: string) => Math.max(0, qty[id] || 0);
  const setItemQty = (id: string, n: number) => {
    const v = Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
    setQty((prev) => ({ ...prev, [id]: v }));
  };
  const addOne = (id: string) => setItemQty(id, getQty(id) + 1);
  const subOne = (id: string) => setItemQty(id, Math.max(0, getQty(id) - 1));

  const selectedItems = useMemo(() => items.filter((it) => getQty(it.id) > 0), [items, qty]);

  const totals = useMemo(() => computeTotals(items, qty), [items, qty]);

  // 使っていないが将来の拡張で便利
  const categoryMap = useMemo(() => byCategory(items), [items]);

  const passFail = useMemo(() => {
    return {
      budget: targets.budget === undefined ? true : totals.price <= targets.budget,
      kcal: targets.maxKcal === undefined ? true : totals.kcal <= targets.maxKcal,
      protein: targets.minProtein === undefined ? true : totals.protein >= targets.minProtein,
      salt: targets.maxSalt === undefined ? true : totals.salt <= targets.maxSalt,
    };
  }, [targets, totals]);

  const filtered = useMemo(() => simpleFilter(items, query), [items, query]);

  const exportSelectionText = () => {
    const lines: string[] = [];
    lines.push(`【注文メモ】${new Date().toLocaleString("ja-JP")}\n`);
    items.forEach((it) => {
      const q = getQty(it.id);
      if (q > 0)
        lines.push(`・${it.name}（${it.category}）×${q}: ${it.price}円 × ${q} = ${it.price * q}円`);
    });
    lines.push("――――――――――――――――――");
    lines.push(
      `合計: ${totals.price}円 / ${totals.kcal}kcal / たんぱく質${totals.protein}g / 食塩${totals.salt}g / 品数${totals.count}`
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saizeriya_order_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const payload = { items, targets };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saizeriya_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // --- 保存機能 ---
  const saveCurrent = () => {
    const saved = createSavedCombo(saveName, qty, targets);
    setSaves((prev) => [...prev.slice(-MAX_SAVES + 1), saved]);
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
    a.download = `saizeriya_saves_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSaves = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((s: any) => validateSavedCombo(s));
          setSaves((prev) => [...prev, ...valid].slice(-MAX_SAVES));
        } else {
          throw new Error("配列ではありません");
        }
      } catch (e) {
        alert("保存データの読み込みに失敗しました\n" + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // 簡易オプティマイザ：予算内でP/円が高い順に1個ずつ詰める（重複可）
  const greedyOptimizeProtein = () => {
    const budget = targets.budget ?? 1000;
    const sorted = [...items].sort((a, b) => {
      const ra = (a.protein || 0) / a.price;
      const rb = (b.protein || 0) / b.price;
      return rb - ra;
    });
    const next: Record<string, number> = {};
    let cost = 0;
    outer: while (true) {
      for (const it of sorted) {
        if (cost + it.price <= budget) {
          next[it.id] = (next[it.id] || 0) + 1;
          cost += it.price;
        }
        if (sorted.length === 0 || cost + Math.min(...sorted.map((x) => x.price)) > budget) break outer;
      }
      if (sorted.every((it) => cost + it.price > budget)) break;
    }
    setQty(next);
  };

  const randomUnderBudget = () => {
    const budget = targets.budget ?? 1000;
    const pool = [...items].sort(() => Math.random() - 0.5);
    const next: Record<string, number> = {};
    let cost = 0;
    for (const it of pool) {
      const repeat = Math.random() > 0.5 ? 2 : 1; // たまに2個
      for (let r = 0; r < repeat; r++) {
        if (cost + it.price <= budget && Math.random() > 0.25) {
          next[it.id] = (next[it.id] || 0) + 1;
          cost += it.price;
        }
      }
    }
    setQty(next);
  };

  const reset = () => setQty({});

  const violations = [
    { key: "budget", label: "予算", ok: passFail.budget, hint: `≦ ${targets.budget ?? "-"}円` },
    { key: "kcal", label: "カロリー", ok: passFail.kcal, hint: `≦ ${targets.maxKcal ?? "-"}kcal` },
    { key: "protein", label: "たんぱく質", ok: passFail.protein, hint: `≧ ${targets.minProtein ?? "-"}g` },
    { key: "salt", label: "食塩相当量", ok: passFail.salt, hint: `≦ ${targets.maxSalt ?? "-"}g` },
  ];

  const categories: Category[] = [
    "主食",
    "おかず",
    "サラダ/前菜",
    "サイド",
    "デザート",
    "ドリンク",
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">サイゼリヤ・メニュー組み合わせシミュレーター</h1>
            <p className="text-sm text-neutral-400">個人用・シンプル版（数量・保存対応／ローカル保存）</p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-2xl px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "閉じる" : "メニュー編集"}
            </button>
            <label className="rounded-2xl px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 cursor-pointer">
              JSON読込
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files && importJson(e.target.files[0])}
              />
            </label>
            <button
              className="rounded-2xl px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700"
              onClick={exportJson}
            >
              JSON書出
            </button>
          </div>
        </header>

        {/* Summary + Controls */}
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">合計</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-neutral-400">金額</div>
              <div className="font-medium">{yen(totals.price)}</div>
              <div className="text-neutral-400">品数</div>
              <div className="font-medium">{totals.count}</div>
              <div className="text-neutral-400">カロリー</div>
              <div className="font-medium">{num(totals.kcal, "kcal")}</div>
              <div className="text-neutral-400">たんぱく質</div>
              <div className="font-medium">{num(totals.protein, "g")}</div>
              <div className="text-neutral-400">脂質</div>
              <div className="font-medium">{num(totals.fat, "g")}</div>
              <div className="text-neutral-400">炭水化物</div>
              <div className="font-medium">{num(totals.carbs, "g")}</div>
              <div className="text-neutral-400">食塩相当量</div>
              <div className="font-medium">{num(totals.salt, "g")}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                onClick={exportSelectionText}
              >
                注文メモを書出
              </button>
              <button
                className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                onClick={reset}
              >
                数量クリア
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">目標・制約</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2">
                <span className="w-24 text-neutral-400">予算</span>
                <input
                  type="number"
                  className="w-full rounded-lg bg-neutral-900 px-2 py-1"
                  value={targets.budget ?? ""}
                  placeholder="例: 1000"
                  onChange={(e) => setTargets({ ...targets, budget: Number(e.target.value) || undefined })}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 text-neutral-400">最大kcal</span>
                <input
                  type="number"
                  className="w-full rounded-lg bg-neutral-900 px-2 py-1"
                  value={targets.maxKcal ?? ""}
                  placeholder="例: 900"
                  onChange={(e) => setTargets({ ...targets, maxKcal: Number(e.target.value) || undefined })}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 text-neutral-400">最小P</span>
                <input
                  type="number"
                  className="w-full rounded-lg bg-neutral-900 px-2 py-1"
                  value={targets.minProtein ?? ""}
                  placeholder="例: 20"
                  onChange={(e) => setTargets({ ...targets, minProtein: Number(e.target.value) || undefined })}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 text-neutral-400">最大塩分</span>
                <input
                  type="number"
                  className="w-full rounded-lg bg-neutral-900 px-2 py-1"
                  value={targets.maxSalt ?? ""}
                  placeholder="例: 6"
                  onChange={(e) => setTargets({ ...targets, maxSalt: Number(e.target.value) || undefined })}
                />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                onClick={greedyOptimizeProtein}
              >
                P/円重視で自動選定
              </button>
              <button
                className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
                onClick={randomUnderBudget}
              >
                予算内ランダム
              </button>
              <label className="ml-auto flex items-center gap-2 text-neutral-400">
                <input
                  type="checkbox"
                  checked={showOnlyViolations}
                  onChange={(e) => setShowOnlyViolations(e.target.checked)}
                />
                違反のみ表示
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {violations.map((v) => (
                <div
                  key={v.key}
                  className={`rounded-lg border px-2 py-1 ${v.ok ? "border-green-900 bg-green-950/40" : "border-red-900 bg-red-950/40"}`}
                >
                  <span className="mr-2 text-neutral-400">{v.label}</span>
                  <span className={`font-medium ${v.ok ? "text-green-300" : "text-red-300"}`}>
                    {v.ok ? "OK" : "要調整"}
                  </span>
                  <span className="ml-2 text-xs text-neutral-500">{v.hint}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">検索・操作</h2>
            <input
              className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm"
              placeholder="メニュー名・タグ・カテゴリで検索 (例: パスタ / 高たんぱく / ピザ)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="mt-3 text-xs text-neutral-400">
              品数: <span className="text-neutral-200 font-medium">{totals.count}</span> / メニュー数: {items.length}
            </div>
          </div>

          {/* 保存・プリセット */}
          <div className="rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">保存・プリセット</h2>
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                placeholder="保存名（例: 低kcal/筋トレ日）"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
              <button className="rounded-xl bg-emerald-700 px-3 py-2 text-sm hover:bg-emerald-600" onClick={saveCurrent}>
                保存
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700" onClick={exportSaves}>保存一覧をエクスポート</button>
              <label className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700 cursor-pointer">
                保存を読込
                <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importSaves(e.target.files[0])} />
              </label>
            </div>
            <div className="mt-3 max-h-60 space-y-2 overflow-auto pr-1">
              {saves.length === 0 && (
                <div className="text-xs text-neutral-500">保存はまだありません。現在の選択を保存すると、ここに表示されます。</div>
              )}
              {[...saves].reverse().map((s) => {
                const preview = computeTotals(items, s.qty);
                const missing = Object.keys(s.qty).filter((id) => !items.some((it) => it.id === id)).length;
                return (
                  <div key={s.id} className="rounded-xl border border-neutral-800 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{s.name}</div>
                        <div className="text-[11px] text-neutral-500">{new Date(s.createdAt).toLocaleString("ja-JP")}</div>
                        <div className="text-[11px] text-neutral-400">合計 {yen(preview.price)} / P{preview.protein}g / 品数{preview.count}</div>
                        {missing > 0 && (
                          <div className="text-[11px] text-amber-400">※ {missing}件の品が現在のメニューに存在しません</div>
                        )}
                      </div>
                      <div className="shrink-0 space-x-2 text-xs">
                        <button className="rounded bg-neutral-800 px-2 py-1 hover:bg-neutral-700" onClick={() => loadSave(s)}>読込</button>
                        <button className="rounded bg-neutral-800 px-2 py-1 hover:bg-neutral-700" onClick={() => deleteSave(s.id)}>削除</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Menu List */}
        <section className="mt-6">
          {categories.map((cat) => {
            const group = filtered.filter((it) => it.category === cat);
            if (!group.length) return null;
            return (
              <div key={cat} className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{cat}</h3>
                  <div className="flex gap-2 text-xs">
                    <button
                      className="rounded-xl bg-neutral-900 px-2 py-1 hover:bg-neutral-800"
                      onClick={() => {
                        const next = { ...qty };
                        group.forEach((g) => (next[g.id] = (next[g.id] || 0) + 1));
                        setQty(next);
                      }}
                    >
                      このカテゴリを+1
                    </button>
                    <button
                      className="rounded-xl bg-neutral-900 px-2 py-1 hover:bg-neutral-800"
                      onClick={() => {
                        const next = { ...qty };
                        group.forEach((g) => (next[g.id] = 0));
                        setQty(next);
                      }}
                    >
                      このカテゴリを解除
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((it) => {
                    const q = getQty(it.id);
                    const isOn = q > 0;
                    const show =
                      !showOnlyViolations ||
                      ((!passFail.budget && (targets.budget ?? Infinity) < totals.price && isOn) ||
                        (!passFail.kcal && (targets.maxKcal ?? Infinity) < totals.kcal && isOn) ||
                        (!passFail.salt && (targets.maxSalt ?? Infinity) < totals.salt && isOn) ||
                        (!passFail.protein && (targets.minProtein ?? 0) > totals.protein && !isOn));
                    if (!showOnlyViolations || show) {
                      return (
                        <div
                          key={it.id}
                          className={`rounded-2xl border p-3 transition ${
                            isOn
                              ? "border-emerald-500/60 bg-emerald-950/20"
                              : "border-neutral-800 bg-neutral-900/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="font-medium">{it.name}</div>
                                <div className="text-sm">{yen(it.price)}</div>
                              </div>
                              <div className="mt-1 grid grid-cols-5 gap-2 text-xs text-neutral-300">
                                <div>{num(it.kcal, "kcal")}</div>
                                <div>P {num(it.protein, "g")}</div>
                                <div>F {num(it.fat, "g")}</div>
                                <div>C {num(it.carbs, "g")}</div>
                                <div>塩 {num(it.salt, "g")}</div>
                              </div>
                              {it.tags && (
                                <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-neutral-300">
                                  {it.tags.map((t) => (
                                    <span key={t} className="rounded bg-neutral-800 px-1.5 py-0.5">#{t}</span>
                                  ))}
                                </div>
                              )}
                              {/* 数量ステッパー */}
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                                  onClick={() => subOne(it.id)}
                                  aria-label="減らす"
                                >
                                  −
                                </button>
                                <input
                                  className="w-14 rounded-lg bg-neutral-900 px-2 py-1 text-center"
                                  type="number"
                                  min={0}
                                  value={q}
                                  onChange={(e) => setItemQty(it.id, Number(e.target.value))}
                                />
                                <button
                                  className="h-8 w-8 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                                  onClick={() => addOne(it.id)}
                                  aria-label="増やす"
                                >
                                  ＋
                                </button>
                                <div className="ml-auto text-xs text-neutral-400">
                                  小計: {yen((it.price || 0) * q)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* Editor */}
        {editMode && (
          <section className="mt-6 rounded-2xl border border-neutral-800 p-4">
            <h2 className="mb-2 text-lg font-semibold">メニュー編集（JSON）</h2>
            <p className="mb-2 text-sm text-neutral-400">
              価格・栄養はダミー初期値です。ご自身の値に上書きしてください。idは一意にしてください。
            </p>
            <JsonEditor items={items} setItems={setItems} />
          </section>
        )}

        <footer className="mt-10 border-t border-neutral-900 pt-4 text-xs text-neutral-500">
          <p>
            ※ このツールは個人用の試作です。表示値の正確性を保証しません。実際のメニュー・栄養は店頭・公式情報をご確認ください。
          </p>
        </footer>
      </div>
    </div>
  );
}

function JsonEditor({ items, setItems }: { items: Item[]; setItems: (v: Item[]) => void }) {
  const [text, setText] = useState(JSON.stringify(items, null, 2));
  useEffect(() => {
    setText(JSON.stringify(items, null, 2));
  }, [items]);

  const tryApply = () => {
    try {
      const next = JSON.parse(text);
      if (!Array.isArray(next)) throw new Error("配列ではありません");
      // ざっくりバリデーション
      next.forEach((it: Item, i: number) => {
        if (!it.id) throw new Error(`${i} 行目: id がありません`);
        if (!it.name) throw new Error(`${i} 行目: name がありません`);
        if (!it.category) throw new Error(`${i} 行目: category がありません`);
        if (typeof it.price !== "number") throw new Error(`${i} 行目: price が数値ではありません`);
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
      category: "主食",
      price: 500,
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      salt: 0,
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
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <button className="rounded-xl bg-neutral-800 px-3 py-1 hover:bg-neutral-700" onClick={addTemplate}>
          行を追加
        </button>
        <button className="rounded-xl bg-emerald-700 px-3 py-1 hover:bg-emerald-600" onClick={tryApply}>
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

// --- Self Tests (console) ---
(function runSelfTests() {
  try {
    console.group("SaizeriyaSimulator self-tests");

    // sum
    console.assert(sum([1, 2, 3]) === 6, "sum basic");

    // yen formatting (just check contains digits and a yen sign)
    const y = yen(1234);
    console.assert(/1,234/.test(y), "yen digits");
    console.assert(/[¥￥]/.test(y), "yen symbol");

    // yen/num undefined
    console.assert(yen(undefined) === "-", "yen undefined");
    console.assert(num(undefined) === "-", "num undefined");

    // computeTotals
    const testItems: Item[] = [
      { id: "a", name: "A", category: "主食", price: 100, protein: 10 },
      { id: "b", name: "B", category: "おかず", price: 200, protein: 5 },
    ];
    const testQty = { a: 2, b: 1 } as Record<string, number>;
    const t = computeTotals(testItems, testQty);
    console.assert(t.price === 400, "totals price"); // 100*2 + 200*1
    console.assert(t.protein === 25, "totals protein"); // 10*2 + 5

    // zero quantities
    const tZero = computeTotals(testItems, { a: 0, b: 0 });
    console.assert(tZero.price === 0 && tZero.protein === 0 && tZero.count === 0, "totals zero qty");

    // simpleFilter (tag & name mixed)
    const filterItems: Item[] = [
      { id: "p1", name: "ペペロンチーノ", category: "主食", price: 400, tags: ["パスタ"] },
      { id: "p2", name: "ハンバーグ", category: "おかず", price: 500 },
    ];
    const f1 = simpleFilter(filterItems, "パスタ");
    console.assert(f1.length === 1 && f1[0].id === "p1", "filter by tag");
    const f2 = simpleFilter(filterItems, "ハンバーグ");
    console.assert(f2.length === 1 && f2[0].id === "p2", "filter by name");
    const f3 = simpleFilter(filterItems, "Pasta"); // case-insensitive (ASCII only)
    console.assert(f3.length === 1 && f3[0].id === "p1", "filter ascii case-insensitive");

    // saved combo pure fns
    const sv = createSavedCombo("テスト保存", { a: 2, x: 3, b: 0, c: -5 }, { budget: 500 });
    console.assert(validateSavedCombo(sv), "validateSavedCombo ok");
    console.assert(!("b" in sv.qty) && !("c" in sv.qty), "saved removes zero/negative");
    const t2 = computeTotals(testItems, sv.qty); // 'x' はメニューに無いので無視
    console.assert(t2.price === 200, "saved totals ignore missing ids");

    console.groupEnd();
  } catch (e) {
    console.error("Self tests failed:", e);
  }
})();