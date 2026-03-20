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

export type Restaurant = {
  id: string;       // 識別子 例: "saizeriya"
  name: string;     // 表示名 例: "サイゼリヤ"
  categories: string[];      // カテゴリの順序定義
  items: Item[];             // メニュー一覧
  defaultTargets: Targets;   // 初回起動時のデフォルト予算
};
