import type { Restaurant } from "../types";

// 価格はすべて税込・2026年5月7日価格改定後
// 出典: https://japan.kfc.co.jp/news_release/8147
// ※ 期間限定品「ザ・アメリカンバーガーズ」「レモン香るパリパリ旨塩チキン」は数量限定

const kfc: Restaurant = {
  id: "kfc",
  name: "ケンタッキー",
  iframeSrc: "./kfc-sim.html",
  categories: ["バーガー", "チキン", "ツイスター", "サイドメニュー", "ドリンク"],
  defaultTargets: { budget: 1500 },
  tagOrder: ["バーガー", "期間限定", "ランチ", "辛口", "チーズ", "ダブル", "チキン", "パック", "ツイスター", "ポテト", "サイドメニュー", "デザート", "ドリンク"],

  items: [
    // ──── バーガー（定番・価格据え置き） ────
    { id: "kfc_burger_fillet",      name: "チキンフィレバーガー",                           category: "バーガー", price: 440,  tags: ["バーガー", "定番"] },
    { id: "kfc_burger_wafuu",       name: "和風チキンカツバーガー",                           category: "バーガー", price: 440,  tags: ["バーガー", "定番"] },
    { id: "kfc_burger_spicy",       name: "辛口チキンフィレバーガー",                         category: "バーガー", price: 470,  tags: ["バーガー", "辛口", "定番"] },
    { id: "kfc_burger_cheese",      name: "チーズチキンフィレバーガー",                        category: "バーガー", price: 470,  tags: ["バーガー", "チーズ", "定番"] },
    { id: "kfc_burger_double",      name: "ダブルチキンフィレバーガー",                        category: "バーガー", price: 680,  tags: ["バーガー", "ダブル", "定番"] },
    // ──── バーガー（期間限定: ザ・アメリカンバーガーズ 2026/5/27〜） ────
    { id: "kfc_burger_onion",       name: "NEW YORK style オニオンリングフィレバーガー",        category: "バーガー", price: 580,  tags: ["バーガー", "期間限定"] },
    { id: "kfc_burger_avocado",     name: "TEXAS style スパイシーアボカドフィレバーガー",        category: "バーガー", price: 580,  tags: ["バーガー", "期間限定", "辛口"] },
    { id: "kfc_burger_doubledown",  name: "LAS VEGAS style ダブルダウンフィレバーガー",          category: "バーガー", price: 790,  tags: ["バーガー", "期間限定", "ダブル"] },
    // ──── ケンタランチ550コンビ（10:00〜15:00）────
    { id: "kfc_lunch_fillet",       name: "チキンフィレバーガー＋ビスケット（ランチ）",           category: "バーガー", price: 550,  tags: ["バーガー", "ランチ"] },
    { id: "kfc_lunch_wafuu",        name: "和風チキンカツバーガー＋ビスケット（ランチ）",          category: "バーガー", price: 550,  tags: ["バーガー", "ランチ"] },

    // ──── チキン（定番） ────
    { id: "kfc_chicken_original",   name: "オリジナルチキン",                                  category: "チキン", price: 330,   tags: ["チキン", "定番"] },
    { id: "kfc_chicken_boneless",   name: "骨なしケンタッキー",                                 category: "チキン", price: 330,   tags: ["チキン", "定番"] },
    { id: "kfc_crispy",             name: "カーネルクリスピー",                                  category: "チキン", price: 290,   tags: ["チキン"] },
    { id: "kfc_nugget5",            name: "ナゲット 5ピース",                                    category: "チキン", price: 480,   tags: ["チキン"] },
    // ──── チキン（期間限定） ────
    { id: "kfc_c_paripari",         name: "レモン香るパリパリ旨塩チキン",                        category: "チキン", price: 340,   tags: ["チキン", "期間限定"] },
    // ──── トクトクパック ────
    { id: "kfc_pack4",              name: "トクトクパック 4ピース",                              category: "チキン", price: 1540,  tags: ["チキン", "パック"] },
    { id: "kfc_pack6",              name: "トクトクパック 6ピース",                              category: "チキン", price: 2390,  tags: ["チキン", "パック"] },
    { id: "kfc_pack8",              name: "トクトクパック 8ピース",                              category: "チキン", price: 2940,  tags: ["チキン", "パック"] },
    { id: "kfc_barrel10",           name: "10ピースバーレル",                                    category: "チキン", price: 3100,  tags: ["チキン", "パック"] },
    // ──── 食べくらべパック（旨塩チキン入り・期間限定）────
    { id: "kfc_mix4",               name: "食べくらべ 4ピースパック",                            category: "チキン", price: 1540,  tags: ["チキン", "パック", "期間限定"] },
    { id: "kfc_mix6",               name: "食べくらべ 6ピースパック",                            category: "チキン", price: 2290,  tags: ["チキン", "パック", "期間限定"] },
    { id: "kfc_mix10",              name: "パリパリ旨塩おためしバーレル",                         category: "チキン", price: 2980,  tags: ["チキン", "パック", "期間限定"] },

    // ──── ツイスター ────
    { id: "kfc_twister_pepper",     name: "ペッパーマヨツイスター",                              category: "ツイスター", price: 380, tags: ["ツイスター"] },
    { id: "kfc_twister_teriyaki",   name: "てりやきツイスター",                                  category: "ツイスター", price: 380, tags: ["ツイスター"] },

    // ──── サイドメニュー ────
    { id: "kfc_potato_s",           name: "ポテト(S)",                                           category: "サイドメニュー", price: 290,  tags: ["ポテト"] },
    { id: "kfc_potato_l",           name: "ポテト(L)",                                           category: "サイドメニュー", price: 490,  tags: ["ポテト"] },
    { id: "kfc_potato_box",         name: "ポテト(BOX)",                                         category: "サイドメニュー", price: 990,  tags: ["ポテト"] },
    { id: "kfc_coleslaw_s",         name: "コールスロー(S)",                                      category: "サイドメニュー", price: 290,  tags: ["サイドメニュー"] },
    { id: "kfc_coleslaw_m",         name: "コールスロー(M)",                                      category: "サイドメニュー", price: 390,  tags: ["サイドメニュー"] },
    { id: "kfc_biscuit",            name: "ビスケット",                                           category: "サイドメニュー", price: 290,  tags: ["サイドメニュー"] },
    { id: "kfc_chocopie",           name: "チョコパイ",                                           category: "サイドメニュー", price: 290,  tags: ["デザート"] },

    // ──── ドリンク ────
    { id: "kfc_drink_s",            name: "ドリンク(S)",                                          category: "ドリンク", price: 270,  tags: ["ドリンク"] },
    { id: "kfc_drink_m",            name: "ドリンク(M)",                                          category: "ドリンク", price: 290,  tags: ["ドリンク"] },
    { id: "kfc_drink_l",            name: "ドリンク(L)",                                          category: "ドリンク", price: 340,  tags: ["ドリンク"] },
    { id: "kfc_coffee",             name: "コーヒー",                                              category: "ドリンク", price: 290,  tags: ["ドリンク"] },
  ],
};

export default kfc;
