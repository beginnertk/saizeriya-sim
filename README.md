\# サイゼリヤ・シミュレーター

公開URL： https://beginnertk.github.io/saizeriya-sim/



\## ローカル開発

\- 起動：`npm run dev`（http://localhost:5173/saizeriya-sim/ を開く）

\- 停止：PowerShellで `Ctrl + C`



\## 更新の流れ（本番反映）

1\. ソース修正 → 保存

2\. ビルド：`npm run build`

3\. 公開：`npx.cmd gh-pages -d dist -b gh-pages` （Published と出ればOK）



\## トラブル時のメモ

\- GitHub Pagesで白画面 → `vite.config.ts` の `base: '/saizeriya-sim/'` を確認

\- 直リンク/リロードで404 → `predeploy`で `dist/404.html` を生成しているか確認



