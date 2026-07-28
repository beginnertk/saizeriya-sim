import type { Restaurant } from "../types";

// 大久保ベーカリー（東京都目黒区目黒4-12-2 / TEL 03-6712-2722）
// 火〜金 8:30-16:00 / 土 10:00-16:00 / 日・月定休。2022年11月オープン。
// 国産小麦（北海道産中心）・自家培養酵母。イートインなし・売切次第終了。
//
// 【データ出所】公式サイト・公式メニュー表なし。
// 以下3系統のリサーチ結果を突き合わせて作成:
//   (A) 確度・調査時期つきの構造化データ（本ファイルの基準）
//   (B) 2026年前半時点の追加調査（クロワッサン・スペルト・オリーブチャバタを補完）
//   (C) カテゴリ別の価格表（(A)と10〜20円ずれる品が複数あったため、
//       衝突分は(A)を採用。(C)にしか出てこない品は "参考価格" タグを付けて採用）
//
// 【タグ "参考価格" について】
// 裏付けが1系統のみ、または調査時期が古く現価格と乖離の可能性がある品に付与。
// 内部識別用ではなく利用者向けの注記なので、タグ一覧にも表示される。
//
// 【除外した候補】
// 「チョコラ」…チョコフランスとの重複疑い / 「クルミ(400円)」…くるみパン・
// レーズン＆クルミとの混同疑い / 「あんコッペ(450円)」…裏付けなし・価格が不自然

const okubo: Restaurant = {
  id: "okubo",
  name: "大久保ベーカリー",
  categories: ["食パン・食事パン", "ハード系", "菓子パン", "惣菜・サンド", "焼き菓子・その他"],
  defaultTargets: { budget: 1500 },
  accentColor: "#b5793a", // 焼き色のブラウン系
  tagOrder: [
    "食パン・食事パン", "ハード系", "菓子パン", "惣菜・サンド", "焼き菓子・その他",
    "人気", "定番", "全粒粉", "ナッツ", "ドライフルーツ", "甘い", "食事",
    "曜日限定", "参考価格",
  ],

  items: [
    // ──── 食パン・食事パン ────
    { id: "ok_english_muffin", name: "イングリッシュマフィン", category: "食パン・食事パン", price: 170, tags: ["食パン・食事パン", "食事", "参考価格"] },
    { id: "ok_milk_pan", name: "ミルクパン", category: "食パン・食事パン", price: 170, tags: ["食パン・食事パン", "参考価格"] },
    { id: "ok_kurumi_pan", name: "くるみパン", category: "食パン・食事パン", price: 200, tags: ["食パン・食事パン", "ナッツ", "参考価格"] },
    { id: "ok_baguette", name: "バゲット", category: "食パン・食事パン", price: 320, tags: ["食パン・食事パン", "食事", "参考価格"] },
    { id: "ok_shokupan_yamagata", name: "山型食パン（1斤）", category: "食パン・食事パン", price: 400, tags: ["食パン・食事パン", "人気", "定番"] },

    // ──── ハード系 ────
    // 同一商品のサイズ違い・派生品は隣接させる（グループ内最安値の順）
    { id: "ok_ciabatta", name: "チャバタ", category: "ハード系", price: 150, tags: ["ハード系", "食事"] },
    { id: "ok_komeko_ciabatta", name: "米粉のチャバタ", category: "ハード系", price: 270, tags: ["ハード系", "曜日限定"], period: "火・金曜のみ" },
    { id: "ok_olive_ciabatta", name: "オリーブチャバタ", category: "ハード系", price: 280, tags: ["ハード系", "食事", "参考価格"] },

    { id: "ok_focaccia", name: "フォカッチャ", category: "ハード系", price: 180, tags: ["ハード系", "食事"] },
    { id: "ok_potato_focaccia", name: "じゃがいものフォカッチャ", category: "ハード系", price: 340, tags: ["ハード系", "食事"] },

    { id: "ok_zenryufun_half", name: "全粒粉のパン（ハーフ）", category: "ハード系", price: 230, tags: ["ハード系", "全粒粉"] },
    { id: "ok_zenryufun_whole", name: "全粒粉のパン（1本）", category: "ハード系", price: 420, tags: ["ハード系", "全粒粉"] },

    { id: "ok_ginger_peel_nuts", name: "生姜ピールとナッツ", category: "ハード系", price: 290, tags: ["ハード系", "ナッツ", "参考価格"] },
    { id: "ok_macadamia", name: "マカダミア", category: "ハード系", price: 330, tags: ["ハード系", "ナッツ"] },
    { id: "ok_raisin_almond", name: "レーズン＆アーモンド", category: "ハード系", price: 390, tags: ["ハード系", "ナッツ", "ドライフルーツ", "参考価格"] },
    { id: "ok_campagne", name: "カンパーニュ（1/4）", category: "ハード系", price: 400, tags: ["ハード系", "定番", "食事"] },
    { id: "ok_raisin_walnut", name: "レーズン＆クルミ", category: "ハード系", price: 420, tags: ["ハード系", "ナッツ", "ドライフルーツ"] },

    { id: "ok_spelt_half", name: "スペルト（ハーフ）", category: "ハード系", price: 450, tags: ["ハード系", "食事", "参考価格"] },
    { id: "ok_spelt_whole", name: "スペルト（ホール）", category: "ハード系", price: 900, tags: ["ハード系", "食事", "参考価格"] },

    { id: "ok_cranberry", name: "クランベリー", category: "ハード系", price: 460, tags: ["ハード系", "ナッツ", "ドライフルーツ", "参考価格"] },

    // ──── 菓子パン ────
    { id: "ok_melon_pan", name: "メロンパン", category: "菓子パン", price: 200, tags: ["菓子パン", "甘い", "定番"] },
    { id: "ok_budo_pan", name: "ぶどうパン", category: "菓子パン", price: 200, tags: ["菓子パン", "ドライフルーツ", "甘い"] },
    { id: "ok_choco_france", name: "チョコフランス", category: "菓子パン", price: 210, tags: ["菓子パン", "甘い"] },
    { id: "ok_cream_pan", name: "クリームパン", category: "菓子パン", price: 220, tags: ["菓子パン", "甘い", "参考価格"] },
    { id: "ok_donut", name: "ドーナツ", category: "菓子パン", price: 250, tags: ["菓子パン", "甘い"] },
    { id: "ok_nejineji_donut", name: "ねじねじドーナツ", category: "菓子パン", price: 260, tags: ["菓子パン", "甘い"] },
    { id: "ok_croissant", name: "クロワッサン", category: "菓子パン", price: 320, tags: ["菓子パン", "曜日限定"], period: "木・土曜のみ" },

    // ──── 惣菜・サンド ────
    { id: "ok_curry_pan", name: "カレーパン", category: "惣菜・サンド", price: 280, tags: ["惣菜・サンド", "食事"] },
    { id: "ok_flambee", name: "フランベ", category: "惣菜・サンド", price: 350, tags: ["惣菜・サンド", "食事", "参考価格"] },
    { id: "ok_tomato_pizza", name: "トマトのピザ", category: "惣菜・サンド", price: 420, tags: ["惣菜・サンド", "食事", "参考価格"] },
    { id: "ok_rape_sand", name: "ラペサンド", category: "惣菜・サンド", price: 500, tags: ["惣菜・サンド", "食事", "参考価格"] },
    { id: "ok_namaham_sand", name: "生ハムサンド", category: "惣菜・サンド", price: 580, tags: ["惣菜・サンド", "食事", "参考価格"] },
    { id: "ok_banhmi_pork", name: "豚肉のバインミー", category: "惣菜・サンド", price: 600, tags: ["惣菜・サンド", "食事", "人気"] },

    // ──── 焼き菓子・その他 ────
    { id: "ok_sdgs_pan", name: "SDGsパン（1袋）", category: "焼き菓子・その他", price: 100, tags: ["焼き菓子・その他", "参考価格"], expiry: "前日残りのカット詰合せ・在庫不定" },
    { id: "ok_scone_plain", name: "スコーン（プレーン）", category: "焼き菓子・その他", price: 220, tags: ["焼き菓子・その他", "甘い"] },
    { id: "ok_madeleine", name: "パン屋さんのマドレーヌ", category: "焼き菓子・その他", price: 250, tags: ["焼き菓子・その他", "甘い", "人気"] },
    { id: "ok_framboise_tart", name: "フランボワーズのチーズタルト", category: "焼き菓子・その他", price: 500, tags: ["焼き菓子・その他", "甘い", "参考価格"] },
  ],
};

export default okubo;
