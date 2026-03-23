# 外食メニューシミュレーター - 開発ガイド（Claude Code用）

## プロジェクト概要
飲食チェーン店のメニューを事前に組み合わせて合計金額を確認できるWebアプリ。
- 公開URL: https://beginnertk.github.io/saizeriya-sim/
- GitHub: https://github.com/beginnertk/saizeriya-sim
- 現在サイゼリヤ・日高屋の2店舗に対応

## 技術スタック
React 18 + TypeScript + Tailwind CSS v3 + Vite 5 + GitHub Pages

## ファイル構成
```
src/
├── types.ts              # 型定義（Restaurant, MenuItem等）
├── App.tsx               # 店舗選択トップ画面
├── Simulator.tsx         # 共通シミュレーター画面
└── restaurants/
    ├── index.ts          # レストラン一覧（RESTAURANTS配列）
    ├── saizeriya.ts      # サイゼリヤデータ
    └── hidakaya.ts       # 日高屋データ
```

## 設計思想
- **データとUIの分離**: 各店舗の.tsファイル（データ）とSimulator.tsx（UI）を完全分離
- **拡張性重視**: 新店舗追加 = データファイル作成 + index.ts登録のみで完了
- **シンプル設計**: 栄養情報は扱わず、価格のみを管理

## コーディング規約（厳守）
1. TypeScriptの型定義を省略しない（Restaurant, MenuItem型に必ず従う）
2. Tailwind CSSでスタイリング（別CSSファイルは原則不要）
3. function宣言 + export defaultを基本とする
4. 変更時は「ファイル名 + 何を変えるか」を明示してからコード提示

## 新店舗追加の手順
### 1. データファイル作成（例：`src/restaurants/newstore.ts`）
```typescript
import { Restaurant } from '../types';

const newstore: Restaurant = {
  id: 'newstore',
  name: '店舗名',
  menuItems: [
    { id: 'item1', name: 'メニュー名', price: 500, category: 'カテゴリ' },
    // ...
  ]
};

export default newstore;
```

### 2. レストラン一覧に登録（`src/restaurants/index.ts`）
```typescript
import newstore from './newstore';

export const RESTAURANTS: Restaurant[] = [
  saizeriya,
  hidakaya,
  newstore,  // ← 追加
];
```

### 3. ローカル確認
```bash
npm run dev
```

### 4. 公開反映
```bash
git add .
git commit -m "Add newstore menu"
git push origin main
```

## よく使うコマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド（デプロイ前確認）
npm run build

# git操作（変更を公開サイトに反映）
git status                    # 変更確認
git add .                     # 全変更をステージング
git commit -m "メッセージ"    # コミット
git push origin main          # GitHub Pagesに自動デプロイ
```

## 実装済みの重要な変更（新チャットでも必ず把握すること）

### 日高屋セットメニュー（テーブル形式は変更禁止）
`hidakaya.ts` の `category: "セット"` のアイテムは**テーブルUIの仕組みを壊さないこと**。
- 28種の組み合わせセット（ラーメン4種 × サイド7種）+ 「半ラ・餃3・半チャのセット」の計29品
- テーブルUI連動は **`setCell: [列キー, 行キー]`** フィールドで管理（タグではなくなった）
  - 列キー: `"chuka"` `"tonkotsu"` `"miso"` `"tanmen"`
  - 行キー: `"hancyahan"` `"yakitori"` `"gyoza"` `"hancyahan_gyoza3"` `"hancyahan_gyoza6"` `"yakitori_gyoza3"` `"yakitori_gyoza6"`
- `types.ts` に `SetTableConfig` 型と `setCell?: [string, string]`、`Simulator.tsx` に `SetTableGrid` コンポーネントがある
- 「半ラ・餃3・半チャのセット」は `setCell` なし・`tags: ["special", ...]` でカード表示

### localStorageキャッシュ問題（解決済み）
- `items`（メニューデータ）は `restaurant.items` を直接参照（useState不使用・localStorageにも保存しない）
- `qty`・`targets`・`saves` は引き続きlocalStorageに保存
- ソースコードのメニューデータを変更したら **F5リロードだけで反映される**（バージョンキーの変更不要）
- 現在のキー: `gaisyoku-sim-v3:{restaurant.id}`

### 日高屋カテゴリ構成
順序: セット → 定食 → ラーメン → 単品 → おつまみ → トッピング
- ラーメンは系統ごとにまとめて並べる（中華そば系・とんこつ系・タンメン系・味噌系・その他）
- 並び順ルール: 価格安い順。ただし「X」と「X+α」（例: 野菜炒め→肉野菜炒め、半チャーハン→チャーハン→大盛）は隣接させる

### タグ体系のルール
- **タグ = そのメニューの特徴**（例: `["定食", "ご飯", "肉", "辛い"]`）
- 定食は全品に `ご飯` タグ付き
- ラーメンは全品に `麺類` タグ付き
- セットは全品に `セット` `ラーメン` タグ付き。`ご飯`（半チャーハン・焼き鳥丼含む）・`餃子`（餃子含む）も付ける
- テーブルUI連動用の `ramen:xxx` `side:xxx` 形式のタグは廃止済み（`setCell`フィールドに移行）
- セットテーブルの列順: 中華そば → とんこつ → 味噌 → タンメン（価格安い順）

### UIの実装済み機能
- **カテゴリタブ**: 上部に横並びタブ、選択したカテゴリのみ表示（スクロール対応）。タブに選択品数バッジあり
- セットカテゴリのみ表形式（SetTableGrid・セル内に小サムネイル付き）、他はカードグリッド（2列〜4列）
- **メニュー画像**: `Item.image` フィールドで各カードに写真表示（日高屋は全カテゴリ対応済み）
  - 画像URL: `https://hidakaya.hiday.co.jp/hits/outimages/picture/{UUID}` 形式（外部参照）
- 品数はソースコードの `restaurant.items` から直接カウント（キャッシュ非依存）
- **カード/セルタップ選択**: メニューの枠全体をタップで選択トグル（0→1 or >0→0）。内部の＋−ボタンはstopPropagationで独立動作
- **固定フッターバー**: 画面下部に合計金額・品数を常時表示（`fixed bottom-0`）
- **選択リストドロワー**: フッターバーをタップで展開。選択中メニューの一覧・数量操作・削除が可能。1品でも選ぶと自動展開。タグはメニュー名の横にインライン表示
- **保存プリセットUI**: 保存済み一覧はトグル開閉式（デフォルト閉）。検索バー＋並べ替え（新しい順/安い順/高い順）付き
- **URLシェア機能**: 「共有リンク生成」ボタンで選択状態をURLハッシュに埋め込み（`#r=hidakaya&q=item:1,...`）。App.tsxで起動時にハッシュを読み取り自動復元
- **タグクリックフィルタ**: タグをタップするとそのタグを持つメニューだけ絞り込み。もう一度タップで解除。検索バー下に絞り込み中チップを表示

### JSON編集機能（削除済み）
- メニュー編集/JSON読込/JSON書出ボタンとJsonEditorコンポーネントは削除済み
- メニューデータの編集はソースコード（.tsファイル）で行う

## 現在のTODO（優先度順）
1. [ ] サイゼリヤにも画像を追加（公式: https://www.saizeriya.co.jp/menu/）
2. [ ] ブランドカラー導入（日高屋=赤系、サイゼリヤ=緑系）
3. [ ] スマホ実機でのUI確認（特にセットの表の横スクロール、固定バーの表示）
4. [ ] 3店舗目の追加

## トラブルシューティング

### 画面が真っ白になる（ReferenceError: Cannot access 'X' before initialization）
- **原因**: `useState`や`useEffect`などのReact hookがコンポーネント内で散在している
- **対策**: hookは必ずコンポーネント関数の**先頭にまとめて宣言**する。通常の関数定義の途中にhookを置かない
- F12 → Console でエラーメッセージを確認

### ビルドエラーが出る
- 型定義の不備をチェック（types.tsとの整合性）
- `npm run build`で事前確認

### 公開サイトに反映されない
- GitHub Actionsのワークフロー確認（`.github/workflows/deploy.yml`）
- pushから2-3分待つ
- GitHub Pagesの設定確認

### ローカルサーバーが起動しない
- `npm install`で依存関係を再インストール
- ポート3000が使われていないか確認

## 開発者について（重要）
- **スキルレベル**: プログラミング初心者（コードを読んだ経験少ない）
- **説明の方針**: 
  - 丁寧に、ステップを飛ばさない
  - 「なぜそうするか」を必ず添える
  - 専門用語には簡単なたとえ話を添える
  - 「この行は何をしているか」をコメントや直後の解説で説明
- **作業の進め方**:
  - 大きな変更は小さなステップに分割
  - 各ステップの最後に「確認ポイント」を明示
  - コードの「読み方」も教える

## 作業の基本フロー
1. ユーザーが「〇〇したい」と要望を伝える
2. Claude Codeが作業の全体像を説明（「今から3つやります：①②③」）
3. 1つずつステップを実行、コードの意味を解説
4. ユーザーが動作確認
5. 問題があればフィードバック → 修正
6. OKなら次のステップへ
```

---