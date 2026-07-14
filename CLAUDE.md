# 外食メニューシミュレーター 開発ガイド

## 概要
飲食チェーン店のメニュー組み合わせ・合計金額確認Webアプリ。
- 公開URL: https://beginnertk.github.io/saizeriya-sim/
- GitHub: https://github.com/beginnertk/saizeriya-sim
- 対応店舗: サイゼリヤ・日高屋・モスバーガー・ケンタッキー・玉川屋（和菓子）・中華そば竹むら

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
    ├── mos.ts
    ├── kfc.ts
    ├── tamagawaya.ts
    └── takemura.ts

public/
├── mos-sim.html      # モスバーガー専用スタンドアロンUI
├── kfc-sim.html      # ケンタッキー専用スタンドアロンUI
└── _redirects        # SPA用リダイレクト設定

src/App.backup.tsx    # 不要な残留ファイル（削除予定）
```

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

## ビルド・デプロイ

### ビルドコマンド
```
npm run build
```
`package.json` の build スクリプト: `shx rm -rf dist && vite build`

**重要**: OneDrive フォルダ内で dist が残っているとビルドがハングする（OneDriveのファイルロック競合）。
`shx rm -rf dist` を先に実行することで回避済み。`npm run build` だけで OK。

### デプロイ
`git push origin main` するだけ。GitHub Actions (`.github/workflows/deploy.yml`) が自動でbuild→gh-pagesブランチへデプロイ。push後2〜3分で反映。

**重要**: ローカルで`npm run deploy`（gh-pagesパッケージ）は使わない・スクリプト自体削除済み。
Actionsとローカルデプロイが同じgh-pagesブランチを同時に更新すると、GitHub Pages公式の
「pages build and deployment」ジョブが競合してfailureになり、pushしたのに公開サイトへ
反映されない事象が発生した（2026-07-06）。デプロイ経路はActions一本化で統一。

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

### ブランドカラー（accentColor）
- `Restaurant`型に`accentColor?: string`（HEX、例:"#e3231d"）
- Simulator.tsx冒頭で`hexToRgb()`によりRGBに変換し、`--accent`〜`--accent-light`等のCSS変数をルート要素の`style`にセット
- Tailwindのクラスは`bg-[var(--accent)]`のようなarbitrary value記法で参照（`bg-emerald-700`等の固定クラスは使用禁止・全店舗共通デザインを保つため）
- 未指定時はデフォルト値`#059669`（旧来のエメラルドグリーンと同じ見た目）にフォールバック
- 現在設定済み: 日高屋`#e3231d`（赤系）・サイゼリヤ`#1e9e4a`（緑系）。他店舗は未設定＝デフォルト色
- 正確な公式コーポレートカラーは非公開のため、ブランドイメージに近い近似色

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

### 予算探索モード（逆算検索）
- Simulator.tsx使用店舗（saizeriya, hidakaya, tamagawaya, takemura）で共通利用可。iframeSrc店舗（mos, kfc）は対象外
- ヘッダー直下に「メニュー選択」⇔「予算探索」の`viewMode`切替タブを追加
- 探索ロジックは`src/budgetSearch.ts`に純関数として分離（`computeTotals`等と同じスタイル）
  - `gcdAll(prices)`: 全価格の最大公約数。店の価格が全てg円刻みなら合計も必ずg円刻みになる一般原理を利用し、到達可能性の事前判定に使う
  - `groupByPrice(items)`: 同カテゴリ・同価格のアイテムを1グループにまとめる（「互換品グループ化」オプション用）
  - `searchCombinations(items, config)`: メイン探索関数。価格降順ソート後、combinations-with-replacement（同一品複数選択可）を深さ優先で再帰探索
- `BudgetSearchConfig`（`types.ts`）: `budget` `maxItems`（既定4）`mode`（`exact`/`maximize-price`/`maximize-count`）`requiredIds`（必須品）`excludedIds`（除外品）`categoryLimits`（カテゴリ別上限個数）`groupEquivalents`（互換品グループ化）
  - localStorageキー `gaisyoku-sim-v3:{restaurant.id}:searchConfig` に保存（既存の`usePersistentState`パターンを踏襲）
- 到達不可能時（`budget % gcd !== 0`、exactモードのみ）: 切り下げ／切り上げの最寄り達成可能額をボタン提示、タップで`searchConfig.budget`を更新し再探索
- 結果は「品数→合計額」の順で安定ソート、件数上限400（cap）・探索ノード数上限20万で早期リターン。cap到達時は「先頭N件・さらに一致あり」と明示
- 必須品は探索前にコストとカテゴリ数を確定し残額・カテゴリ上限カウントに反映してから探索、結果に頭出しで結合する方式（必須品分をcatCount初期値に含めないとカテゴリ上限が正しく効かないバグを実装時に一度踏んだので要注意）
- 各結果に「この組み合わせを選択」ボタン→`qty`へ反映し`viewMode`を"menu"に戻す（`applySearchResult`関数）
- 自動テスト基盤なし（package.jsonにtest scriptなし）。手動確認は`npm run dev`で実施

### 独自UIを持つ店舗（iframeSrc方式）
- `Restaurant` 型に `iframeSrc?: string` フィールドあり
- 設定時: App.tsx がその店舗選択時に `<iframe src={iframeSrc}>` を表示（Simulator.tsxをスキップ）
- 上部に「← 店舗選択に戻る」バーを表示
- **iframeSrcのパス解決**（App.tsx実装）:
  - DEVモード: `/${selected.iframeSrc}`（Viteのpublic配信ルート）
  - prodモード: `${import.meta.env.BASE_URL}${selected.iframeSrc}`（例: `/saizeriya-sim/mos-sim.html`）
- モスバーガー: `iframeSrc: "./mos-sim.html"` → `public/mos-sim.html`
- ケンタッキー: `iframeSrc: "./kfc-sim.html"` → `public/kfc-sim.html`
- 新店舗で独自UIが必要な場合: HTMLファイルをpublic/に置き + `iframeSrc` を設定するだけ
- iframeSrc店舗はURLシェア・プリセット保存非対応（各HTMLファイルが独自実装）

### URLシェアの仕組み（2種類）
- 選択メニューをシェア: `#r={id}&q={itemId:qty,...}` → `initialQty` → `qty`
- 全プリセットをシェア: `#r={id}&saves={base64json}` → `initialCloudId` → `pendingImport`
- App.tsxの`parseShareHash()`でデコード → Simulatorに`initialQty`/`initialCloudId`として渡す
- 外部サービス不使用・URL直接エンコード方式（btoa/atob）
- URLシェアにはアドオン情報は含まれない（割り切り）

### 各店舗の独自UI（スタンドアロンHTML）
純粋なHTML/CSS/JSで実装。外部ライブラリなし。

**モスバーガー** (`public/mos-sim.html`)
- テーマ: モスレッド (#c8102e)・クリーム系背景・Zen Maru Gothic
- クーポン機能: 抹茶シェイクSをクーポン価格に切り替えるトグル

**ケンタッキー** (`public/kfc-sim.html`)
- テーマ: KFCレッド (#da291c)・黒背景タブバー・Bebas Neue (英語見出し)
- クーポン機能（〜6/2）: カーネルクリスピー半額・ビスケット半額・レモン旨塩チキン40円引き
- 価格: 2026年5月7日改定後（オリジナルチキン330円・ポテトL 490円等）

### 玉川屋（和菓子・目黒）
- 独自UIではなく共通Simulator.tsxをそのまま使用（`iframeSrc`未設定）
- データ出典: 公式サイト https://www.wagashi-tamagawaya.com/menu 配下7ページ（年間/春/夏/秋/冬/お彼岸お盆/慶弔）
- カテゴリ = 季節（`categories: ["年間","春","夏","秋","冬","お彼岸・お盆","慶弔"]`）。タグは使用せず`tagOrder: []`
- 画像は公式サイトの`/_p/4630/images/pc/*.JPG`を直リンク参照（ダウンロード・同梱なし）
- **`Item`型に`period`と`expiry`の2フィールドを追加**（他店舗は使用しない、玉川屋専用）
  - `period` = 公式サイトに明記された「販売期間」のみ（例:"5月中旬〜9月中旬"）。季節限定品のみ設定、通年品は無指定
  - `expiry` = 公式サイトの「賞味期限」「消費期限」原文をそのまま格納（例:"消費期限 当日"）
  - カード表示: `period`→`expiry`の順で商品名の下に小さく表示（`Simulator.tsx`）
  - **注意**: 一覧ページ（例: 年間ページ）には販売期間の記載がなく、賞味期限/消費期限のみのカテゴリが多い。カテゴリ名（秋・冬等）は季節分類であって販売期間の保証ではない。データ追加・修正時は必ず公式サイトの生HTMLを確認すること（WebFetchのAI要約は「販売期間」列を推測で埋めることがあるため、生HTML未確認のまま実装した際に実在しない"通年"表記を作ってしまった過去の失敗あり）
- 除外品（価格未記載・販売休止中・変動価格・別価格重複のため）:
  - 栗きんとん（冬）・紅白饅頭（慶弔）: 公式サイトに価格記載なし
  - 花見団子（春）・チョコレート饅頭（年間）: 販売休止中
  - 蓮の上「蓮の葉入り」（お彼岸・お盆）: 「900円前後」で重量により変動、ユーザー判断で不要
  - 慶弔カテゴリのお赤飯8種: 年間カテゴリの同名品と別価格のため重複、ユーザー判断で不要

### 中華そば竹むら（目黒・権之助坂）
- 独自UIではなく共通Simulator.tsxをそのまま使用（`iframeSrc`未設定）
- **公式サイトなし**。データはユーザーがGoogleマップ・食べログ等のメニュー表をclaude.aiでテキスト化して提供したもの → 画像URLなし（`image`未設定）
- カテゴリ = `["麺","トッピング","ご飯もの"]`。タグ未使用（`tagOrder: []`）
- 麺カテゴリは日高屋と同じ`setTable`形式（列=並/特製/焼豚/味玉の4段階、行=ラーメン4種類）
- 価格の正確性は情報源依存（他サイトでは異なる価格の記載もあり）。改定があればユーザー申告ベースで更新

## 現在のTODO（優先度順）
1. [x] サイゼリヤに画像追加 → 18品中10品に画像追加済み（公式`saizeriya.co.jp/menu-popular/`の個別ページに画像URLあり）。
   残り8品（焼きチーズミラノ風ドリア・半熟卵のミラノ風ドリア・きのことほうれん草のクリームスパゲッティ・
   ミートソース・チーズフォッカチオ・ガーリックフォッカチオ・柔らかチキンのチーズ焼き・トリフアイスクリーム）は
   公式サイトに個別ページ自体が存在せず画像URL未取得（`saizeriya.co.jp/menu/`はデジタルブック形式でページ全体スキャン画像のみ、個別商品画像なし）。
   なお「柔らかチキンのチーズ焼き」は2026-03-24付リリースでチキンステーキ商品が販売休止中の可能性あり、要現状確認
2. [x] ブランドカラー導入（日高屋=赤系、サイゼリヤ=緑系）→ `Restaurant.accentColor`（HEX）フィールド追加、
   Simulator.tsxがCSS変数(`--accent`等)に変換して選択済みカード・ボタン・タブ等の`emerald`系クラスを置換。
   日高屋`#e3231d`・サイゼリヤ`#1e9e4a`を設定、未指定店舗はデフォルトのエメラルドグリーン(`#059669`)のまま
3. [x] スマホ実機UI確認 → ユーザー自身で随時確認済み
4. [x] `src/App.backup.tsx` を削除（不要な残留ファイル）→ 削除済み（2026-07-14）
5. [x] GitHub Pages デプロイ後に `mos-sim.html` / `kfc-sim.html` のパスが正しく解決されるか確認 → 公開サイトで200確認済み（2026-07-06）
6. [x] 予算探索モード追加 → `src/budgetSearch.ts`新規・`Simulator.tsx`にモード切替タブ＋`BudgetSearchPanel`追加。
   ロジックはNode(tsx)で手動検証済み（gcd計算・到達不可能判定・必須/除外/カテゴリ上限・最大化モード・グループ化）。
   UI実機確認もユーザーが`npm run dev`で確認済み（2026-07-14）。コミット8e1bda5でGitHub Pagesにもデプロイ済み

## トラブルシューティング
- **画面真っ白**: React hookがコンポーネント先頭以外にある → 先頭にまとめる
- **ビルドがハングする**: `dist` フォルダがOneDriveにロックされている → `npm run build` に `shx rm -rf dist &&` を先付けして解決済み（package.json修正済み）
- **ビルドエラー**: types.tsとの型整合性を確認 → `npm run build` で事前確認
- **公開反映されない**: GitHub Actions確認・push後2-3分待つ
- **ローカル起動しない**: `npm install` で依存関係再インストール
