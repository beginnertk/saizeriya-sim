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
};

// セットカテゴリを表形式で表示するための設定
export type SetTableConfig = {
  category: string;   // 表形式にするカテゴリ名（例: "セット"）
  cols: string[];     // 横軸のラベル（例: ["中華そば", "とんこつ"]）
  colTags: string[];  // 横軸に対応するタグ名（例: ["chuka", "tonkotsu"]）
  rows: string[];     // 縦軸のラベル（例: ["半チャーハン", "餃子"]）
  rowTags: string[];  // 縦軸に対応するタグ名（例: ["hancyahan", "gyoza"]）
};

export type Restaurant = {
  id: string;       // 識別子 例: "saizeriya"
  name: string;     // 表示名 例: "サイゼリヤ"
  categories: string[];      // カテゴリの順序定義
  items: Item[];             // メニュー一覧
  defaultTargets: Targets;   // 初回起動時のデフォルト予算
  setTable?: SetTableConfig; // セットカテゴリを表形式で表示する設定（任意）
};
