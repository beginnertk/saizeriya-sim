// ============================================================
// 型定義ファイル
// 栄養情報は完全に削除。価格・カテゴリ・タグのみ管理。
// ============================================================

export type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  tags?: string[];
  image?: string;    // メニュー画像のURL（任意）
  setCell?: [string, string]; // セットテーブルの配置 [列タグ, 行タグ]（任意）
  period?: string;   // 販売期間（季節限定品のみ。例:"5月中旬〜9月中旬"）カードに小さく表示（任意）
  expiry?: string;    // 賞味期限・消費期限（例:"消費期限 当日"）カードに小さく表示（任意）
};

export type Targets = {
  budget?: number; // 予算上限（円）
};

export type SavedCombo = {
  id: string;
  name: string;
  createdAt: number; // epoch ms
  qty: Record<string, number>;
  targets?: Targets;
  addonSelections?: Record<string, string[]>; // アイテムID → 選択中トッピングIDリスト
};

// セットカテゴリを表形式で表示するための設定
export type SetTableConfig = {
  category: string;   // 表形式にするカテゴリ名（例: "セット"）
  cols: string[];     // 横軸のラベル（例: ["中華そば", "とんこつ"]）
  colTags: string[];  // 横軸に対応するタグ名（例: ["chuka", "tonkotsu"]）
  rows: string[];     // 縦軸のラベル（例: ["半チャーハン", "餃子"]）
  rowTags: string[];  // 縦軸に対応するタグ名（例: ["hancyahan", "gyoza"]）
};

// ============================================================
// 予算探索モード用の型
// ============================================================

export type BudgetSearchMode = "exact" | "maximize-price" | "maximize-count";

export type BudgetSearchConfig = {
  budget: number;
  maxItems: number; // 品数上限（既定4）
  mode: BudgetSearchMode;
  requiredIds: string[];
  excludedIds: string[];
  categoryLimits: Record<string, number>; // カテゴリ名 → 上限個数
  groupEquivalents: boolean; // 同価格品をグループ化するか
};

export type BudgetSearchResultLine = {
  itemId: string;      // 反映時に採用する代表アイテムID（グループ時は先頭）
  groupIds: string[];  // 同価格候補（グループ化なしなら[itemId]のみ）
  qty: number;
};

export type BudgetSearchResult = {
  lines: BudgetSearchResultLine[];
  total: number;
  count: number;
};

export type BudgetSearchOutcome =
  | { kind: "unreachable"; nearestDown: number | null; nearestUp: number | null; gcd: number }
  | { kind: "ok"; results: BudgetSearchResult[]; truncated: boolean; totalFound: number };

export type Restaurant = {
  id: string;       // 識別子 例: "saizeriya"
  name: string;     // 表示名 例: "サイゼリヤ"
  categories: string[];      // カテゴリの順序定義
  items: Item[];             // メニュー一覧
  defaultTargets: Targets;   // 初回起動時のデフォルト予算
  setTable?: SetTableConfig; // セットカテゴリを表形式で表示する設定（任意）
  tagOrder?: string[];       // タグの表示順序（省略時は出現順）
  categoryAddons?: Record<string, string[]>; // カテゴリ別トッピングショートカット（カテゴリ名 → トッピングIDリスト）
  iframeSrc?: string; // 独自UIを持つ店舗: このURLをiframeで表示（設定時はSimulator.tsxをスキップ）
  accentColor?: string; // ブランドカラー（HEX）。設定時はSimulator.tsxのアクセント色（選択済み/ボタン/タブ等）に反映。省略時はデフォルトのエメラルドグリーン
};
