import type { Item, Restaurant } from "../types";

// マクドナルド 目黒不動前店（店舗コード13260）
// - 公式店舗ページで「特定店舗」表記あり。非公式価格帯マップでは「都心」区分（ビッグマック550円）
// - 価格はユーザーが公式アプリのモバイルオーダー（目黒不動前店選択）で確認した値（2026-10-23 朝マック時間帯）
//   公式サイトのメニュー価格は通常店のものなので使わないこと
// - 画像は公式サイト https://www.mcdonalds.co.jp/product_images/ を直リンク参照
// - 「販売していません」表示の品（チキンマックマフィン系・エビプリオ・チョコパイいちご等）は除外
// - レギュラーメニュー（10:30以降）は未登録

const IMG = "https://www.mcdonalds.co.jp/product_images/";
const MORNING = "朝マック 5:00〜10:30";

// 朝マックのバーガー類（単品・コンビ・セット）
type MorningBurger = {
  key: string;
  name: string;
  single: number;
  combi?: number;
  set: number;
  img: string;
  combiImg?: string;
  setImg: string;
};

const MORNING_BURGERS: MorningBurger[] = [
  { key: "sausage", name: "ソーセージマフィン", single: 200, combi: 280, set: 470, img: "133/4030-Sausage-Muffin.png", combiImg: "2891/9286.png", setImg: "2881/9279.png" },
  { key: "egg", name: "エッグマックマフィン", single: 320, combi: 390, set: 520, img: "12/1410-Egg-McMuffin.png", combiImg: "2889/9284.png", setImg: "2879/9293.png" },
  { key: "bacon_egg", name: "ベーコンエッグマックサンド", single: 330, combi: 400, set: 550, img: "519/bacon-egg-mcsandwich_l.png", combiImg: "2892/9163.png", setImg: "2885/9024.png" },
  { key: "sausage_egg", name: "ソーセージエッグマフィン", single: 400, combi: 440, set: 600, img: "138/4040-Sausage-Egg-Muffin.png", combiImg: "2888/9283.png", setImg: "2878/9258.png" },
  { key: "griddle_s", name: "マックグリドル ソーセージ", single: 290, set: 530, img: "263/8640-McGriddle-Sausage.png", setImg: "2884/9082.png" },
  { key: "griddle_be", name: "マックグリドル ベーコンエッグ", single: 390, set: 610, img: "264/8641-McGriddle-Bacon-Egg.png", setImg: "2883/9012.png" },
  { key: "griddle_se", name: "マックグリドル ソーセージエッグ", single: 440, set: 640, img: "265/8642-McGriddle-Sausage-Egg.png", setImg: "2882/9264.png" },
  { key: "hotcake", name: "ホットケーキ", single: 420, set: 640, img: "129/4010-Hotcakes.png", setImg: "2887/9078.png" },
  { key: "filet", name: "フィレオフィッシュ", single: 460, set: 680, img: "1110/FOF.png", setImg: "2886/9180.png" },
  { key: "mega", name: "メガマフィン", single: 490, set: 710, img: "262/8637-Mega-Muffin.png", setImg: "2877/9014.png" },
];

// 朝マック以外（サイド・スイーツ・ドリンク・マックカフェ・ハッピーセット・クーポン）
// 「〜」付き価格の品は最小サイズの価格を登録し、サイズ別タグを付与
const SIZED = "最小サイズの価格（サイズにより変動）";

const COMMON_ITEMS: Item[] = [
  // ──── サイド ────
  { id: "mc_side_hash", name: "ハッシュポテト", category: "サイド", price: 200, tags: ["朝マック"], period: MORNING, image: IMG + "2846/5010.png" },
  { id: "mc_side_nugget5", name: "チキンマックナゲット 5ピース", category: "サイド", price: 320, image: IMG + "14/1610-chickenmcnuggets5p.png" },
  { id: "mc_side_nugget15", name: "チキンマックナゲット 15ピース", category: "サイド", price: 820, image: IMG + "270/9030-chickenmcnuggets15p.png" },
  { id: "mc_side_edamame", name: "えだまめコーン", category: "サイド", price: 330, image: IMG + "2843/2605.png" },
  { id: "mc_side_salad", name: "サイドサラダ", category: "サイド", price: 400, image: IMG + "2289/2323.png" },
  { id: "mc_side_bbq", name: "バーベキューソース", category: "サイド", price: 60, image: IMG + "2893/5502.png" },
  { id: "mc_side_mustard", name: "マスタードソース", category: "サイド", price: 60, image: IMG + "2894/5503.png" },

  // ──── スイーツ ────
  { id: "mc_sw_applepie", name: "ホットアップルパイ", category: "スイーツ", price: 140, image: IMG + "2292/2110.png" },
  { id: "mc_sw_chocopie", name: "三角チョコパイ 黒", category: "スイーツ", price: 200, image: IMG + "3841/2139.png" },
  { id: "mc_sw_petitpancake", name: "プチパンケーキ", category: "スイーツ", price: 300, image: IMG + "29/2888-petitpancakes.png" },

  // ──── ドリンク ────
  { id: "mc_dr_coffee", name: "プレミアムローストコーヒー", category: "ドリンク", price: 140, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2857/3528.png" },
  { id: "mc_dr_icecoffee", name: "プレミアムローストアイスコーヒー", category: "ドリンク", price: 140, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2455/3548.png" },
  { id: "mc_dr_coffee_donation", name: "プレミアムローストコーヒー(S) 10円募金付き", category: "ドリンク", price: 150, image: IMG + "3832/9233.png" },
  { id: "mc_dr_icecoffee_donation", name: "プレミアムローストアイスコーヒー(S) 10円募金付き", category: "ドリンク", price: 150, image: IMG + "3833/9234.png" },
  { id: "mc_dr_coke", name: "コカ・コーラ", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2056/3110-cocacola.png" },
  { id: "mc_dr_cokezero", name: "コカ・コーラ ゼロ", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2055/3270-cocacolazero.png" },
  { id: "mc_dr_sprite", name: "スプライト", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2863/3170.png" },
  { id: "mc_dr_fanta_grape", name: "ファンタ グレープ", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2866/3402.png" },
  { id: "mc_dr_fanta_melon", name: "ファンタ メロン", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2869/3416.png" },
  { id: "mc_dr_qoo", name: "Qoo 白ぶどう", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2475/3603.png" },
  { id: "mc_dr_sokenbicha", name: "爽健美茶", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2874/3473.png" },
  { id: "mc_dr_icetea_straight", name: "アールグレイ アイスティー(ストレート)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3708/3739.png" },
  { id: "mc_dr_icetea_lemon", name: "アールグレイ アイスティー(レモン)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3705/3736.png" },
  { id: "mc_dr_icetea_milk", name: "アールグレイ アイスティー(ミルク)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3702/3733.png" },
  { id: "mc_dr_hottea_straight", name: "ホットティー(ストレート)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3714/3748.png" },
  { id: "mc_dr_hottea_lemon", name: "ホットティー(レモン)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3710/3722.png" },
  { id: "mc_dr_hottea_milk", name: "ホットティー(ミルク)", category: "ドリンク", price: 160, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3712/3741.png" },
  { id: "mc_dr_apple", name: "ミニッツメイド アップル100%", category: "ドリンク", price: 220, image: IMG + "2873/3922.png" },
  { id: "mc_dr_yasai", name: "野菜生活100", category: "ドリンク", price: 230, tags: ["サイズ別"], expiry: SIZED, image: IMG + "1161/3801.png" },
  { id: "mc_dr_cafelatte", name: "カフェラテ", category: "ドリンク", price: 250, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2859/3759.png" },
  { id: "mc_dr_icecafelatte", name: "アイスカフェラテ", category: "ドリンク", price: 250, tags: ["サイズ別"], expiry: SIZED, image: IMG + "1683/3775.png" },
  { id: "mc_dr_orange", name: "ミニッツメイド オレンジブレンド100%", category: "ドリンク", price: 290, tags: ["サイズ別"], expiry: SIZED, image: IMG + "3823/3317.png" },
  { id: "mc_dr_caramellatte", name: "キャラメルラテ", category: "ドリンク", price: 310, tags: ["サイズ別"], expiry: SIZED, image: IMG + "2861/3769.png" },
  { id: "mc_dr_icecaramellatte", name: "アイスキャラメルラテ", category: "ドリンク", price: 310, tags: ["サイズ別"], expiry: SIZED, image: IMG + "1685/3779.png" },
  { id: "mc_dr_milk", name: "ミルク", category: "ドリンク", price: 320, image: IMG + "57/3480-milk.png" },
  { id: "mc_dr_mcfizz", name: "マックフィズ 丸搾りレモネード", category: "ドリンク", price: 330, image: IMG + "3864/3263.png" },
  { id: "mc_dr_kurooolong", name: "サントリー黒烏龍茶#濃いめ", category: "ドリンク", price: 380, image: IMG + "68/3930-kuro-oolong.png" },

  // ──── マックカフェ ────
  { id: "mc_cafe_mango", name: "マンゴースムージー", category: "マックカフェ", price: 500, image: IMG + "3763/3468.png" },
  { id: "mc_cafe_cookiefrappe", name: "クッキー＆クリームチョコフラッペ", category: "マックカフェ", price: 520, image: IMG + "3762/3846.png" },

  // ──── ハッピーセット ────
  { id: "mc_happy_petitpancake", name: "プチパンケーキ ハッピーセット", category: "ハッピーセット", price: 570, image: IMG + "3877/9006.png" },
  { id: "mc_happy_egg", name: "エッグマックマフィン ハッピーセット", category: "ハッピーセット", price: 590, tags: ["朝マック"], period: MORNING, image: IMG + "3880/9007.png" },
  { id: "mc_happy_nugget", name: "チキンマックナゲット ハッピーセット", category: "ハッピーセット", price: 590, image: IMG + "3879/9005.png" },
  { id: "mc_happy_hotcake", name: "ホットケーキ ハッピーセット", category: "ハッピーセット", price: 600, tags: ["朝マック"], period: MORNING, image: IMG + "3878/9008.png" },

  // ──── クーポン（アプリクーポン。期限切れになったら削除すること）────
  { id: "mc_cp_coffee_m", name: "プレミアムローストコーヒーM(ホット/アイス)", category: "クーポン", price: 150, tags: ["クーポン"], expiry: "店頭180円 / 1度に2個まで", image: IMG + "2857/3528.png" },
  { id: "mc_cp_chocopie", name: "三角チョコパイ 黒", category: "クーポン", price: 190, tags: ["クーポン"], expiry: "店頭200円 / 1度に2個まで", image: IMG + "3841/2139.png" },
  { id: "mc_cp_mcfizz", name: "マックフィズ 丸搾りレモネード", category: "クーポン", price: 320, tags: ["クーポン"], expiry: "店頭330円 / 1度に2個まで", image: IMG + "3864/3263.png" },
  { id: "mc_cp_chocopie_coffee", name: "三角チョコパイ 黒+プレミアムローストコーヒーS", category: "クーポン", price: 320, tags: ["クーポン"], expiry: "店頭340円 / 1度に2個まで", image: IMG + "3841/2139.png" },
  { id: "mc_cp_egg_set", name: "エッグマックマフィンセット", category: "クーポン", price: 470, tags: ["クーポン", "朝マック"], period: MORNING, expiry: "店頭520円 / 1度に2個まで", image: IMG + "2879/9293.png" },
  { id: "mc_cp_egg_happy", name: "エッグマックマフィン ハッピーセット", category: "クーポン", price: 490, tags: ["クーポン", "朝マック"], period: MORNING, expiry: "店頭590円 / 1度に2個まで", image: IMG + "3880/9007.png" },
  { id: "mc_cp_griddle_be_set", name: "マックグリドル ベーコンエッグセット", category: "クーポン", price: 560, tags: ["クーポン", "朝マック"], period: MORNING, expiry: "店頭610円 / 1度に2個まで", image: IMG + "2883/9012.png" },
];

const CATEGORIES = ["朝マック", "サイド", "スイーツ", "ドリンク", "マックカフェ", "ハッピーセット", "クーポン"];
const TAG_ORDER = ["朝マック", "クーポン", "サイズ別"];

// ============================================================
// A案: 朝マックを表形式（行=バーガー、列=単品/コンビ/セット）
// ============================================================

const tableItems: Item[] = MORNING_BURGERS.flatMap((b) => {
  const list: Item[] = [
    { id: `mc_am_${b.key}`, name: b.name, category: "朝マック", price: b.single, tags: ["朝マック"], period: MORNING, image: IMG + b.img, setCell: ["single", b.key] },
  ];
  if (b.combi !== undefined && b.combiImg) {
    list.push({ id: `mc_am_${b.key}_combi`, name: `${b.name} コンビ`, category: "朝マック", price: b.combi, tags: ["朝マック"], period: MORNING, image: IMG + b.combiImg, setCell: ["combi", b.key] });
  }
  list.push({ id: `mc_am_${b.key}_set`, name: `${b.name} セット`, category: "朝マック", price: b.set, tags: ["朝マック"], period: MORNING, image: IMG + b.setImg, setCell: ["set", b.key] });
  return list;
});

const mcdonalds: Restaurant = {
  id: "mcdonalds",
  name: "マクドナルド（目黒不動前店）",
  categories: CATEGORIES,
  defaultTargets: { budget: 1000 },
  tagOrder: TAG_ORDER,
  accentColor: "#db0007",
  setTable: {
    category: "朝マック",
    cornerLabel: "バーガー ╲ 形態",
    cols: ["単品", "コンビ", "セット"],
    colTags: ["single", "combi", "set"],
    rows: MORNING_BURGERS.map((b) => b.name),
    rowTags: MORNING_BURGERS.map((b) => b.key),
  },
  items: [...tableItems, ...COMMON_ITEMS],
};

export default mcdonalds;
