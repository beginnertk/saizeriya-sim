# 外食メニューシミュレーター 開発ガイド

## 概要
飲食チェーン店のメニュー組み合わせ・合計金額確認Webアプリ。
- 公開URL: https://beginnertk.github.io/saizeriya-sim/
- GitHub: https://github.com/beginnertk/saizeriya-sim
- 対応店舗: サイゼリヤ・日高屋

## 技術スタック
React 18 + TypeScript + Tailwind CSS v3 + Vite 5 + GitHub Pages (GitHub Actions自動デプロイ)

## ファイル構成
```
src/
├── types.ts          # 型定義（Restaurant, MenuItem, SetTableConfig等）
├── App.tsx           # 店舗選択トップ画面・URLハッシュ復元
├── Simulator.tsx     # 共通シミュレーター（SetTableGridコンポーネント含む）
└── restaurants/
    ├── index.ts      # RESTAURANTS配列
    ├── saizeriya.ts
    └── hidakaya.ts
```

## 設計方針
- データ（各.tsファイル）とUI（Simulator.tsx）を完全分離
- 栄養情報は扱わない・価格のみ
- 新店舗追加 = データファイル作成 + index.ts登録のみ

## コーディング規約
1. TypeScriptの型定義を省略しない
2. Tailwind CSSでスタイリング（別CSSファイル不要）
3. function宣言 + export default
4. 変更時は「ファイル名＋変更内容」を先に明示

## 実装済み・変更禁止の重要事項

### 日高屋セットメニュー（テーブルUI）
- `category: "セット"` のアイテムは `setCell: [列キー, 行キー]` フィールドでテーブルUI制御
  - 列キー: `"chuka"` `"tonkotsu"` `"miso"` `"tanmen"`
  - 行キー: `"hancyahan"` `"yakitori"` `"gyoza"` `"hancyahan_gyoza3"` `"hancyahan_gyoza6"` `"yakitori_gyoza3"` `"yakitori_gyoza6"`
- 「半ラ・餃3・半チャのセット」のみ `setCell` なし・`tags: ["special",...]` でカード表示
- `ramen:xxx` / `side:xxx` 形式のタグは廃止済み（setCellに移行）

### localStorageキャッシュ（解決済み）
- `items` は `restaurant.items` 直接参照（useState・localStorage不使用）
- `qty`・`targets`・`saves` のみlocalStorage保存
- 現在のキー: `gaisyoku-sim-v3:{restaurant.id}`
- メニューデータ変更はF5リロードで即反映（バージョンキー変更不要）

### 日高屋カテゴリ順序・並び順ルール
- カテゴリ順: セット → 定食 → ラーメン → 単品 → おつまみ → トッピング
- 並び順: 価格安い順。ただし「X」と「X+α」（例: 半チャーハン→チャーハン）は隣接させる

### タグ体系
- タグ = そのメニューの特徴（例: `["定食","ご飯","肉"]`）
- 定食: 全品に `ご飯` / ラーメン: 全品に `麺類` / セット: `セット` `ラーメン` ＋ 内容に応じ `ご飯` `餃子`

### 実装済みUI機能（変更時は既存挙動を壊さないこと）
- カテゴリタブ（選択品数バッジ付き）
- セットのみテーブル形式（SetTableGrid）、他はカードグリッド（2〜4列）
- 画像表示（日高屋: `https://hidakaya.hiday.co.jp/hits/outimages/picture/{UUID}`）
- カード/セルタップで選択トグル・内部±ボタンはstopPropagation
- 固定フッターバー（合計金額・品数）
- 選択リストドロワー（フッタータップで展開・1品選択で自動展開）
- 保存プリセットUI（トグル開閉・検索＋並べ替え）
- URLシェア（`#r=hidakaya&q=item:1,...` 形式・App.tsxで起動時復元）
- タグクリックフィルタ

## 現在のTODO（優先度順）
1. [ ] サイゼリヤに画像追加（公式: https://www.saizeriya.co.jp/menu/）
2. [ ] ブランドカラー導入（日高屋=赤系、サイゼリヤ=緑系）
3. [ ] スマホ実機UI確認（セット表の横スクロール・固定バー）
4. [ ] 3店舗目の追加

## トラブルシューティング
- **画面真っ白**: React hookがコンポーネント先頭以外にある → 先頭にまとめる
- **ビルドエラー**: types.tsとの型整合性を確認 → `npm run build` で事前確認
- **公開反映されない**: GitHub Actions確認・push後2-3分待つ
- **ローカル起動しない**: `npm install` で依存関係再インストール