# 外食メニューシミュレーター 開発ガイド

## 概要
飲食チェーン店のメニュー組み合わせ・合計金額確認Webアプリ。
- 公開URL: https://beginnertk.github.io/saizeriya-sim/
- GitHub: https://github.com/beginnertk/saizeriya-sim
- 対応店舗: サイゼリヤ・日高屋・モスバーガー

## 技術スタック
React 18 + TypeScript + Tailwind CSS v3 + Vite 5 + GitHub Pages (GitHub Actions自動デプロイ)

## ファイル構成
```
src/
├── types.ts          # 型定義（Restaurant, MenuItem, SetTableConfig等）
├── App.tsx           # 店舗選択トップ画面・URLハッシュ復元・iframe切り替え
├── Simulator.tsx     # 共通シミュレーター（SetTableGridコンポーネント含む）
└── restaurants/
    ├── index.ts      # RESTAURANTS配列
    ├── saizeriya.ts
    ├── hidakaya.ts
    └── mos.ts
```

ルート:
- `mos-sim.html` — モスバーガー専用スタンドアロンUI（独自デザイン・クーポン機能付き）

## 設計方針
- データ（各.tsファイル）とUI（Simulator.tsx）を完全分離
- 栄養情報は扱わない・価格のみ
- 新店舗追加 = データファイル作成 + index.ts登録のみ
- 独自UIを持つ店舗は `iframeSrc` フィールドを設定 → App.tsxがiframe表示に切り替え

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
- `qty`・`targets`・`saves`・`addons` のみlocalStorage保存
- 現在のキー: `gaisyoku-sim-v3:{restaurant.id}`（サフィックス: `:qty` `:targets` `:saves` `:addons`）
- メニューデータ変更はF5リロードで即反映（バージョンキー変更不要）

### 日高屋カテゴリ順序・並び順ルール
- カテゴリ順: セット → 定食 → ラーメン → 単品 → おつまみ → トッピング
- 並び順: 価格安い順。ただし「X」と「X+α」（例: 半チャーハン→チャーハン）は隣接させる

### タグ体系
- タグ = そのメニューの特徴（例: `["定食","ご飯","肉"]`）
- 定食: 全品に `ご飯` / ラーメン: 全品に `麺類` / セット: `セット` `ラーメン` ＋ 内容に応じ `ご飯` `餃子`
- `special` タグは内部識別子（テーブルUIでなくカード表示させるセット品）。UI上のタグ一覧には表示しない

### タグ表示順序（tagOrder）
- `Restaurant` 型に `tagOrder?: string[]` フィールドあり
- 各店舗ファイルに定義済み。新店舗追加時も `tagOrder` を定義すること
- 未定義タグは `tagOrder` の後ろに出現順で追加される

### 予算機能
- `targets.budget`（円）で予算上限管理。`targets` はlocalStorageに保存される
- 残り予算 = `targets.budget - totals.price`
- カード配色ルール:
  - 選択済み: エメラルドグリーン
  - 未選択・デフォルト: 白系グレー（`border-neutral-500/50`）
  - 未選択・追加すると予算オーバー（`it.price > remainingBudget` かつ `remainingBudget >= 0`）: 赤系
- 予算inputは `type="text" inputMode="numeric"` でカンマ表示（`toLocaleString("ja-JP")`）

### アドオン（大盛り等）機能
- `Restaurant` 型に `categoryAddons?: Record<string, string[]>` フィールドあり
  - カテゴリ名 → トッピングアイテムIDリストのマッピング
  - 日高屋: ラーメン→`["hd_top_men_omori"]`、定食→`["hd_top_meshi_omori"]`、セット→両方
- カードに「✓ 麺大盛 +¥80」トグルボタンを表示。タップでそのメニュー専用ON/OFF（他メニューに連動しない）
- アドオンON時の価格表示: `¥420（グレー） +¥80（アンバー） =¥500（白/エメラルド）`
- `addonSelections: Record<string, string[]>` でアイテムIDごとに選択状態を管理
  - localStorageに保存（キー: `gaisyoku-sim-v3:{id}:addons`）
  - 保存プリセットにも含まれる（`SavedCombo.addonSelections`）
  - 合計金額・選択ドロワーの小計にもアドオン価格を反映
  - URLシェアにはアドオン情報は含まれない（割り切り）

### 実装済みUI機能（変更時は既存挙動を壊さないこと）
- カテゴリタブ（通常時=選択数バッジ・タグフィルタ中=タグ該当数バッジ＋該当0は`opacity-40`）
- セットのみテーブル形式（SetTableGrid）、他はカードグリッド（2〜4列）
- カードグリッドにカテゴリ単位「全て+1」「解除」ボタン表示
- カードにタグボタン表示（セットカテゴリーを除く）。タップでフィルタON/OFF
- カードにアドオントグルボタン表示（`categoryAddons` が定義されているカテゴリーのみ）
- 画像表示（日高屋: `https://hidakaya.hiday.co.jp/hits/outimages/picture/{UUID}`）
- カード/セルタップで選択トグル・内部±ボタンはstopPropagation
- 固定フッターバー（合計金額・品数）
- 選択リストドロワー（フッタータップで展開・1品選択で自動展開・アドオン名表示）
- 合計サマリーエリアに「数量クリア」「予算内ランダム」「共有リンク生成」ボタン
- 保存プリセットUI（トグル開閉・検索＋並べ替え・アドオン設定も保存・最大50件）
  - 保存一覧下部にJSONファイルエクスポート/インポートボタン
- URLシェア（`#r=hidakaya&q=item:1,...` 形式・App.tsxで起動時復元）
- 全プリセットURLシェア（`#r={id}&saves={base64json}` 形式）
  - 受信時はインポート確認バナーを表示し、重複IDを除いてマージ
- タグクリックフィルタ（予算・検索ボックス内タグ一覧 / カードのタグボタン）
  - タグフィルタ中: 予算・検索ボックスにカテゴリ別件数ボタン表示（タップでタブ移動）

### 独自UIを持つ店舗（iframeSrc方式）
- `Restaurant` 型に `iframeSrc?: string` フィールドあり
- 設定時: App.tsx がその店舗選択時に `<iframe src={iframeSrc}>` を表示（Simulator.tsxをスキップ）
- 上部に「← 店舗選択に戻る」バーを表示
- モスバーガー: `iframeSrc: "./mos-sim.html"` → ルートの `mos-sim.html` を表示
- 新店舗で独自UIが必要な場合: HTMLファイルをルートに置き + `iframeSrc` を設定するだけ
- iframeSrc店舗はURLシェア・プリセット保存非対応（各HTMLファイルが独自実装）

### URLシェアの仕組み（2種類）
| 用途 | URLパラメータ | 復元先 |
|------|-------------|--------|
| 選択メニューをシェア | `#r={id}&q={itemId:qty,...}` | `initialQty` → `qty` |
| 全プリセットをシェア | `#r={id}&saves={base64json}` | `initialCloudId` → `pendingImport` |
- App.tsxの`parseShareHash()`でデコード → Simulatorに`initialQty`/`initialCloudId`として渡す
- 外部サービス不使用・URL直接エンコード方式（btoa/atob）
- URLシェアにはアドオン情報は含まれない（割り切り）

## 現在のTODO（優先度順）
1. [ ] サイゼリヤに画像追加（公式: https://www.saizeriya.co.jp/menu/）
2. [ ] ブランドカラー導入（日高屋=赤系、サイゼリヤ=緑系）
3. [ ] スマホ実機UI確認（セット表の横スクロール・固定バー）
4. [x] 3店舗目の追加（モスバーガー追加済み・iframeSrc方式）
5. [ ] `src/App.backup.tsx` を削除（不要な残留ファイル）
6. [ ] GitHub Pages デプロイ後に `mos-sim.html` のパス（`./mos-sim.html`）が正しく解決されるか確認

## トラブルシューティング
- **画面真っ白**: React hookがコンポーネント先頭以外にある → 先頭にまとめる
- **ビルドエラー**: types.tsとの型整合性を確認 → `npm run build` で事前確認
- **公開反映されない**: GitHub Actions確認・push後2-3分待つ
- **ローカル起動しない**: `npm install` で依存関係再インストール