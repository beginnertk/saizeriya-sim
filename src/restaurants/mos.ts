import type { Restaurant } from "../types";

// 価格は税込・2025〜2026年時点の公式メニューに基づく
// 抹茶シェイクSはクーポン適用価格(330円)で登録

const mos: Restaurant = {
  id: "mos",
  name: "モスバーガー",
  categories: ["バーガー", "サイド", "ドリンク", "シェイク"],
  defaultTargets: { budget: 1000 },
  tagOrder: ["ハンバーガー類", "ダブル", "ライス・ドッグ", "菜摘", "ホット", "コールド"],
  iframeSrc: "mos-sim.html",

  items: [
    // ──── バーガー / ハンバーガー類 ────
    { id: "mos_b_hamburger",        name: "ハンバーガー",                   category: "バーガー", price: 240, tags: ["ハンバーガー類"] },
    { id: "mos_b_cheeseburger",     name: "チーズバーガー",                 category: "バーガー", price: 280, tags: ["ハンバーガー類"] },
    { id: "mos_b_chicken",          name: "チキンバーガー",                 category: "バーガー", price: 390, tags: ["ハンバーガー類"] },
    { id: "mos_b_fish",             name: "フィッシュバーガー",             category: "バーガー", price: 400, tags: ["ハンバーガー類"] },
    { id: "mos_b_teriyaki",         name: "テリヤキバーガー",               category: "バーガー", price: 470, tags: ["ハンバーガー類"] },
    { id: "mos_b_mos",              name: "モスバーガー",                   category: "バーガー", price: 470, tags: ["ハンバーガー類"] },
    { id: "mos_b_mos_yasai",        name: "モス野菜バーガー",               category: "バーガー", price: 470, tags: ["ハンバーガー類"] },
    { id: "mos_b_teriyaki_chicken", name: "テリヤキチキンバーガー",         category: "バーガー", price: 480, tags: ["ハンバーガー類"] },
    { id: "mos_b_roastkatsu",       name: "ロースカツバーガー",             category: "バーガー", price: 490, tags: ["ハンバーガー類"] },
    { id: "mos_b_ebi",              name: "海老カツバーガー",               category: "バーガー", price: 490, tags: ["ハンバーガー類"] },
    { id: "mos_b_mos_cheese",       name: "モスチーズバーガー",             category: "バーガー", price: 510, tags: ["ハンバーガー類"] },
    { id: "mos_b_spicy_mos",        name: "スパイシーモスバーガー",         category: "バーガー", price: 510, tags: ["ハンバーガー類"] },
    { id: "mos_b_spicy_mos_cheese", name: "スパイシーモスチーズバーガー",   category: "バーガー", price: 550, tags: ["ハンバーガー類"] },
    { id: "mos_b_green_teriyaki",   name: "グリーンバーガー〈テリヤキ〉",   category: "バーガー", price: 590, tags: ["ハンバーガー類"] },
    { id: "mos_b_tobikiri",         name: "とびきりチーズ〜北海道〜",       category: "バーガー", price: 690, tags: ["ハンバーガー類"] },

    // ──── バーガー / ダブル ────
    { id: "mos_b_dbl_hamburger",    name: "ダブルハンバーガー",             category: "バーガー", price: 400, tags: ["ダブル"] },
    { id: "mos_b_dbl_cheese",       name: "ダブルチーズバーガー",           category: "バーガー", price: 440, tags: ["ダブル"] },
    { id: "mos_b_dbl_teriyaki",     name: "ダブルテリヤキバーガー",         category: "バーガー", price: 630, tags: ["ダブル"] },
    { id: "mos_b_dbl_mos",          name: "ダブルモスバーガー",             category: "バーガー", price: 630, tags: ["ダブル"] },
    { id: "mos_b_dbl_mos_yasai",    name: "ダブルモス野菜バーガー",         category: "バーガー", price: 630, tags: ["ダブル"] },
    { id: "mos_b_dbl_mos_cheese",   name: "ダブルモスチーズバーガー",       category: "バーガー", price: 670, tags: ["ダブル"] },

    // ──── バーガー / ライス・ドッグ ────
    { id: "mos_b_rice_kaisenage",   name: "モスライスバーガー 海鮮かきあげ", category: "バーガー", price: 460, tags: ["ライス・ドッグ"] },
    { id: "mos_b_rice_yakiniku",    name: "モスライスバーガー 焼肉",         category: "バーガー", price: 490, tags: ["ライス・ドッグ"] },
    { id: "mos_b_hotdog",           name: "ホットドッグ",                    category: "バーガー", price: 420, tags: ["ライス・ドッグ"] },
    { id: "mos_b_chilidog",         name: "チリドッグ",                      category: "バーガー", price: 450, tags: ["ライス・ドッグ"] },
    { id: "mos_b_spicy_chilidog",   name: "スパイシーチリドッグ",            category: "バーガー", price: 490, tags: ["ライス・ドッグ"] },

    // ──── バーガー / 菜摘 ────
    { id: "mos_b_natsumi_chicken",  name: "菜摘 チキン",         category: "バーガー", price: 410, tags: ["菜摘"] },
    { id: "mos_b_natsumi_fish",     name: "菜摘 フィッシュ",     category: "バーガー", price: 420, tags: ["菜摘"] },
    { id: "mos_b_natsumi_yasai",    name: "菜摘 モス野菜",       category: "バーガー", price: 490, tags: ["菜摘"] },
    { id: "mos_b_natsumi_teriyaki", name: "菜摘 テリヤキチキン", category: "バーガー", price: 500, tags: ["菜摘"] },
    { id: "mos_b_natsumi_roast",    name: "菜摘 ロースカツ",     category: "バーガー", price: 510, tags: ["菜摘"] },
    { id: "mos_b_natsumi_ebi",      name: "菜摘 海老カツ",       category: "バーガー", price: 510, tags: ["菜摘"] },

    // ──── サイド ────
    { id: "mos_s_fries_s",         name: "フレンチフライポテト S",  category: "サイド", price: 270 },
    { id: "mos_s_fries_m",         name: "フレンチフライポテト M",  category: "サイド", price: 330 },
    { id: "mos_s_fries_l",         name: "フレンチフライポテト L",  category: "サイド", price: 390 },
    { id: "mos_s_onipote",         name: "オニポテ",                category: "サイド", price: 330 },
    { id: "mos_s_onion_fry",       name: "オニオンフライ",          category: "サイド", price: 330 },
    { id: "mos_s_mos_chicken",     name: "モスチキン",              category: "サイド", price: 320 },
    { id: "mos_s_nugget",          name: "チキンナゲット (5個)",    category: "サイド", price: 360 },
    { id: "mos_s_salad",           name: "こだわりサラダ",          category: "サイド", price: 330 },
    { id: "mos_s_corn_soup",       name: "コーンスープ",            category: "サイド", price: 380 },
    { id: "mos_s_clam_chowder",    name: "クラムチャウダー",        category: "サイド", price: 380 },

    // ──── ドリンク / ホット ────
    { id: "mos_d_coffee_hot",      name: "ブレンドコーヒー",        category: "ドリンク", price: 300, tags: ["ホット"] },
    { id: "mos_d_tea_hot",         name: "紅茶 (レモン/ミルク)",   category: "ドリンク", price: 300, tags: ["ホット"] },
    { id: "mos_d_latte_hot",       name: "カフェラテ",              category: "ドリンク", price: 360, tags: ["ホット"] },

    // ──── ドリンク / コールド ────
    { id: "mos_d_ice_coffee_s",    name: "アイスコーヒー S",        category: "ドリンク", price: 260, tags: ["コールド"] },
    { id: "mos_d_ice_coffee_m",    name: "アイスコーヒー M",        category: "ドリンク", price: 330, tags: ["コールド"] },
    { id: "mos_d_ice_coffee_l",    name: "アイスコーヒー L",        category: "ドリンク", price: 400, tags: ["コールド"] },
    { id: "mos_d_ice_tea_s",       name: "アイスティー S",          category: "ドリンク", price: 260, tags: ["コールド"] },
    { id: "mos_d_ice_tea_m",       name: "アイスティー M",          category: "ドリンク", price: 330, tags: ["コールド"] },
    { id: "mos_d_ice_tea_l",       name: "アイスティー L",          category: "ドリンク", price: 400, tags: ["コールド"] },
    { id: "mos_d_orange_s",        name: "オレンジブレンド100 S",   category: "ドリンク", price: 290, tags: ["コールド"] },
    { id: "mos_d_orange_m",        name: "オレンジブレンド100 M",   category: "ドリンク", price: 360, tags: ["コールド"] },
    { id: "mos_d_pepsi_s",         name: "ペプシコーラ S",          category: "ドリンク", price: 200, tags: ["コールド"] },
    { id: "mos_d_pepsi_m",         name: "ペプシコーラ M",          category: "ドリンク", price: 270, tags: ["コールド"] },
    { id: "mos_d_pepsi_l",         name: "ペプシコーラ L",          category: "ドリンク", price: 340, tags: ["コールド"] },
    { id: "mos_d_ginger_m",        name: "ジンジャーエール M",      category: "ドリンク", price: 270, tags: ["コールド"] },
    { id: "mos_d_melon_m",         name: "メロンソーダ M",          category: "ドリンク", price: 270, tags: ["コールド"] },
    { id: "mos_d_oolong_m",        name: "アイスウーロン茶 M",      category: "ドリンク", price: 270, tags: ["コールド"] },
    { id: "mos_d_ice_latte_s",     name: "アイスカフェラテ S",      category: "ドリンク", price: 330, tags: ["コールド"] },
    { id: "mos_d_apple_juice",     name: "りんごジュース",          category: "ドリンク", price: 100, tags: ["コールド"] },

    // ──── シェイク ────
    { id: "mos_sh_vanilla_s",      name: "モスシェイク バニラ S",           category: "シェイク", price: 290 },
    { id: "mos_sh_vanilla_m",      name: "モスシェイク バニラ M",           category: "シェイク", price: 360 },
    { id: "mos_sh_coffee_s",       name: "モスシェイク コーヒー S",         category: "シェイク", price: 290 },
    { id: "mos_sh_coffee_m",       name: "モスシェイク コーヒー M",         category: "シェイク", price: 360 },
    { id: "mos_sh_matcha_s",       name: "まぜるシェイク 出雲の抹茶 S (クーポン価格)", category: "シェイク", price: 330 },
    { id: "mos_sh_matcha_m",       name: "まぜるシェイク 出雲の抹茶 M",     category: "シェイク", price: 430 },
  ],
};

export default mos;
