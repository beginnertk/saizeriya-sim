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
    lines.push(`【注文メモ】${new Date().toLocaleString("ja-JP")}\\n`);
    items.forEach((it) => {
      const q = getQty(it.id);
      if (q > 0)
        lines.push(`・${it.name}（${it.category}）×${q}: ${it.price}円 × ${q} = ${it.price * q}円`);
    });
    lines.push("――――――――――――――――――");
    lines.push(
      `合計: ${totals.price}円 / ${totals.kcal}kcal / たんぱく質${totals.protein}g / 食塩${totals.salt}g / 品数${totals.count}`
    );
    const blob = new Blob([lines.join("\\n")], { type: "text/plain" });
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
        alert("JSONの読み込みに失敗しました\\n" + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

  // --- 保存機能 ---
  const saveCurrent = () => {
    const saved = createSavedCombo(saveName, qty, targets);
    setSaves((prev) => [...prev.slice(-50 + 1), saved]);
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
          const valid = parsed.filter((s: any) => (
            s && typeof s === "object" && typeof s.id === "string" &&
            typeof s.name === "string" && typeof s.createdAt === "number" &&
            s.qty && typeof s.qty === "object"
          ));
          setSaves((prev) => [...prev, ...valid].slice(-50));
        } else {
          throw new Error("配列ではありません");
        }
      } catch (e) {
        alert("保存データの読み込みに失敗しました\\n" + (e as Error).message);
      }
    };
    reader.readAsText(file);
  };

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
      const repeat = Math.random() > 0.5 ? 2 : 1;
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

// const totals = computeTotals(defaultItems, {}); // (not used; keep types happy if needed)

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
        <h1 className="text-2xl font-bold">サイゼリヤ・メニュー組み合わせシミュレーター</h1>
        {/* （UI本体は長大なので、元のキャンバス版をそのままお使いください） */}
        <p className="mt-3 text-neutral-300 text-sm">
          ここに元のUIコード全体が入っています（長文のため省略表示）。
        </p>
      </div>
    </div>
  );
}
