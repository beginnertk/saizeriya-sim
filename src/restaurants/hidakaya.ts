import type { Restaurant } from "../types";

// 価格はすべて税込・2025〜2026年時点の公式メニューに基づく
// 一部店舗限定メニューや期間限定品は除外しています

const hidakaya: Restaurant = {
  id: "hidakaya",
  name: "日高屋",
  categories: ["セット", "定食", "ラーメン", "単品", "おつまみ", "トッピング"],
  defaultTargets: { budget: 1000 },

  // セットカテゴリを表形式で表示する設定
  setTable: {
    category: "セット",
    cols: ["中華そば", "とんこつ", "タンメン", "味噌"],
    colTags: ["chuka", "tonkotsu", "tanmen", "miso"],
    rows: ["半チャーハン", "焼き鳥丼", "餃子", "半チャーハン+餃子3個", "半チャーハン+餃子6個", "焼き鳥丼+餃子3個", "焼き鳥丼+餃子6個"],
    rowTags: ["hancyahan", "yakitori", "gyoza", "hancyahan_gyoza3", "hancyahan_gyoza6", "yakitori_gyoza3", "yakitori_gyoza6"],
  },

  items: [
    // ──── セット（28種 + ラ・餃・チャ） ────
    // 半チャーハン × 4種
    { id: "hd_set_chuka_han",    name: "中華そば＋半チャーハンセット",      category: "セット", price: 710,  tags: ["ramen:chuka",    "side:hancyahan"] },
    { id: "hd_set_tonko_han",    name: "とんこつ＋半チャーハンセット",      category: "セット", price: 800,  tags: ["ramen:tonkotsu", "side:hancyahan"] },
    { id: "hd_set_tanmen_han",   name: "タンメン＋半チャーハンセット",      category: "セット", price: 910,  tags: ["ramen:tanmen",   "side:hancyahan"] },
    { id: "hd_set_miso_han",     name: "味噌ラーメン＋半チャーハンセット",  category: "セット", price: 900,  tags: ["ramen:miso",     "side:hancyahan"] },
    // 焼き鳥丼 × 4種
    { id: "hd_set_chuka_yaki",   name: "中華そば＋焼き鳥丼セット",          category: "セット", price: 730,  tags: ["ramen:chuka",    "side:yakitori"] },
    { id: "hd_set_tonko_yaki",   name: "とんこつ＋焼き鳥丼セット",          category: "セット", price: 820,  tags: ["ramen:tonkotsu", "side:yakitori"] },
    { id: "hd_set_tanmen_yaki",  name: "タンメン＋焼き鳥丼セット",          category: "セット", price: 930,  tags: ["ramen:tanmen",   "side:yakitori"] },
    { id: "hd_set_miso_yaki",    name: "味噌ラーメン＋焼き鳥丼セット",      category: "セット", price: 920,  tags: ["ramen:miso",     "side:yakitori"] },
    // 餃子 × 4種
    { id: "hd_set_chuka_gyo",    name: "中華そば＋餃子セット",              category: "セット", price: 700,  tags: ["ramen:chuka",    "side:gyoza"] },
    { id: "hd_set_tonko_gyo",    name: "とんこつ＋餃子セット",              category: "セット", price: 790,  tags: ["ramen:tonkotsu", "side:gyoza"] },
    { id: "hd_set_tanmen_gyo",   name: "タンメン＋餃子セット",              category: "セット", price: 900,  tags: ["ramen:tanmen",   "side:gyoza"] },
    { id: "hd_set_miso_gyo",     name: "味噌ラーメン＋餃子セット",          category: "セット", price: 890,  tags: ["ramen:miso",     "side:gyoza"] },
    // 半チャーハン+餃子3個 × 4種
    { id: "hd_set_chuka_hg3",    name: "中華そば＋半チャーハン＋餃子3個セット",      category: "セット", price: 860,  tags: ["ramen:chuka",    "side:hancyahan_gyoza3"] },
    { id: "hd_set_tonko_hg3",    name: "とんこつ＋半チャーハン＋餃子3個セット",      category: "セット", price: 950,  tags: ["ramen:tonkotsu", "side:hancyahan_gyoza3"] },
    { id: "hd_set_tanmen_hg3",   name: "タンメン＋半チャーハン＋餃子3個セット",      category: "セット", price: 1060, tags: ["ramen:tanmen",   "side:hancyahan_gyoza3"] },
    { id: "hd_set_miso_hg3",     name: "味噌ラーメン＋半チャーハン＋餃子3個セット",  category: "セット", price: 1050, tags: ["ramen:miso",     "side:hancyahan_gyoza3"] },
    // 半チャーハン+餃子6個 × 4種
    { id: "hd_set_chuka_hg6",    name: "中華そば＋半チャーハン＋餃子6個セット",      category: "セット", price: 990,  tags: ["ramen:chuka",    "side:hancyahan_gyoza6"] },
    { id: "hd_set_tonko_hg6",    name: "とんこつ＋半チャーハン＋餃子6個セット",      category: "セット", price: 1080, tags: ["ramen:tonkotsu", "side:hancyahan_gyoza6"] },
    { id: "hd_set_tanmen_hg6",   name: "タンメン＋半チャーハン＋餃子6個セット",      category: "セット", price: 1190, tags: ["ramen:tanmen",   "side:hancyahan_gyoza6"] },
    { id: "hd_set_miso_hg6",     name: "味噌ラーメン＋半チャーハン＋餃子6個セット",  category: "セット", price: 1180, tags: ["ramen:miso",     "side:hancyahan_gyoza6"] },
    // 焼き鳥丼+餃子3個 × 4種
    { id: "hd_set_chuka_yg3",    name: "中華そば＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 880,  tags: ["ramen:chuka",    "side:yakitori_gyoza3"] },
    { id: "hd_set_tonko_yg3",    name: "とんこつ＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 970,  tags: ["ramen:tonkotsu", "side:yakitori_gyoza3"] },
    { id: "hd_set_tanmen_yg3",   name: "タンメン＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 1080, tags: ["ramen:tanmen",   "side:yakitori_gyoza3"] },
    { id: "hd_set_miso_yg3",     name: "味噌ラーメン＋焼き鳥丼＋餃子3個セット",      category: "セット", price: 1070, tags: ["ramen:miso",     "side:yakitori_gyoza3"] },
    // 焼き鳥丼+餃子6個 × 4種
    { id: "hd_set_chuka_yg6",    name: "中華そば＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1010, tags: ["ramen:chuka",    "side:yakitori_gyoza6"] },
    { id: "hd_set_tonko_yg6",    name: "とんこつ＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1100, tags: ["ramen:tonkotsu", "side:yakitori_gyoza6"] },
    { id: "hd_set_tanmen_yg6",   name: "タンメン＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1210, tags: ["ramen:tanmen",   "side:yakitori_gyoza6"] },
    { id: "hd_set_miso_yg6",     name: "味噌ラーメン＋焼き鳥丼＋餃子6個セット",      category: "セット", price: 1200, tags: ["ramen:miso",     "side:yakitori_gyoza6"] },
    // 単独セット
    { id: "hd_ragyo_cha",        name: "半ラ・餃3・半チャのセット",                   category: "セット", price: 690,  tags: ["special"] },

    // ──── 定食（安い順、X→X+αをまとめて隣接）────
    { id: "hd_yasai_itame_set",      name: "野菜炒め定食",               category: "定食", price: 700, tags: ["野菜", "人気"] },
    { id: "hd_niku_yasai_set",       name: "肉野菜炒め定食",             category: "定食", price: 840, tags: ["肉", "野菜"] }, // ↑野菜炒めのX+α
    { id: "hd_nira_reba_set",        name: "ニラレバ炒め定食",           category: "定食", price: 810, tags: ["レバー"] },
    { id: "hd_bakudan_set",          name: "バクダン炒め定食",           category: "定食", price: 830, tags: ["辛い"] },
    { id: "hd_shogayaki_set",        name: "生姜焼き定食",               category: "定食", price: 850, tags: ["肉"] },
    { id: "hd_w_dragon_set",         name: "Wドラゴンチキン定食",        category: "定食", price: 850, tags: ["辛い"] },
    { id: "hd_w_gyoza_kimchi_set",   name: "W餃子定食（白菜キムチ）",   category: "定食", price: 860, tags: ["餃子"] },
    { id: "hd_w_gyoza_karaage_set",  name: "W餃子定食（唐揚げ２個）",   category: "定食", price: 860, tags: ["餃子", "揚げ物"] }, // ↑W餃子の別バリアント
    { id: "hd_karaage_set",          name: "唐揚げ定食",                 category: "定食", price: 870, tags: ["揚げ物"] },

    // ──── ラーメン（安い順、系統ごとにまとめて隣接）────
    { id: "hd_han_ramen",            name: "半ラーメン",                         category: "ラーメン", price: 240,  tags: [] },
    // 中華そば系
    { id: "hd_chuka_soba",           name: "中華そば",                           category: "ラーメン", price: 420,  tags: ["定番", "人気"] },
    { id: "hd_ajitama_chuka",        name: "味玉中華そば",                       category: "ラーメン", price: 540,  tags: ["定番"] },
    { id: "hd_chuka_chashumen",      name: "中華チャーシューメン",               category: "ラーメン", price: 750,  tags: [] },
    // とんこつ系
    { id: "hd_tonkotsu",             name: "とんこつラーメン",                   category: "ラーメン", price: 510,  tags: ["とんこつ"] },
    { id: "hd_ajitama_tonkotsu",     name: "味玉とんこつラーメン",               category: "ラーメン", price: 630,  tags: ["とんこつ"] },
    { id: "hd_pirika_tonkotsu_negi", name: "ピリ辛とんこつネギラーメン",         category: "ラーメン", price: 680,  tags: ["とんこつ", "辛い"] },
    { id: "hd_tonkotsu_chashumen",   name: "とんこつチャーシューメン",           category: "ラーメン", price: 840,  tags: ["とんこつ"] },
    { id: "hd_pirika_tonkotsu_cha",  name: "ピリ辛とんこつネギチャーシューメン", category: "ラーメン", price: 1010, tags: ["とんこつ", "辛い"] },
    // タンメン系
    { id: "hd_tanmen_sukuname",      name: "野菜たっぷりタンメン（麺少なめ）",  category: "ラーメン", price: 590,  tags: ["野菜"] },
    { id: "hd_tanmen",               name: "野菜たっぷりタンメン",               category: "ラーメン", price: 620,  tags: ["野菜", "人気"] },
    { id: "hd_negi_tower_tanmen",    name: "ネギタワータンメン",                 category: "ラーメン", price: 770,  tags: ["野菜"] },
    // 味噌系
    { id: "hd_miso_ramen",           name: "味噌ラーメン",                       category: "ラーメン", price: 610,  tags: ["味噌"] },
    { id: "hd_karamiso",             name: "秘伝の辛味噌ラーメン",               category: "ラーメン", price: 640,  tags: ["味噌", "辛い"] },
    { id: "hd_miso_butter",          name: "味噌バターラーメン",                 category: "ラーメン", price: 730,  tags: ["味噌"] },
    { id: "hd_negi_tower_miso",      name: "ネギタワー味噌ラーメン",             category: "ラーメン", price: 760,  tags: ["味噌"] },
    { id: "hd_miso_chashumen",       name: "味噌チャーシューメン",               category: "ラーメン", price: 940,  tags: ["味噌"] },
    { id: "hd_karamiso_chashumen",   name: "秘伝の辛味噌チャーシューメン",       category: "ラーメン", price: 970,  tags: ["味噌", "辛い"] },
    { id: "hd_negi_tower_miso_cha",  name: "ネギタワー味噌チャーシューメン",     category: "ラーメン", price: 1090, tags: ["味噌"] },
    // その他
    { id: "hd_jiru_nashi",           name: "汁なしラーメン",                     category: "ラーメン", price: 640,  tags: [] },
    { id: "hd_gomoku_ankake",        name: "五目あんかけラーメン",               category: "ラーメン", price: 720,  tags: [] },
    { id: "hd_katayakisoba",         name: "カタヤキソバ",                       category: "ラーメン", price: 720,  tags: ["店舗限定"] },
    { id: "hd_chige_miso",           name: "チゲ味噌ラーメン",                   category: "ラーメン", price: 790,  tags: ["辛い", "期間限定"] },

    // ──── 単品（安い順、X→X+αをまとめて隣接）────
    { id: "hd_soup",                 name: "スープ",                 category: "単品", price: 20,  tags: [] },
    // ライス系
    { id: "hd_han_rice",             name: "半ライス",               category: "単品", price: 150, tags: [] },
    { id: "hd_rice",                 name: "ライス",                 category: "単品", price: 210, tags: [] },
    { id: "hd_rice_set",             name: "ライスセット",           category: "単品", price: 230, tags: [] },
    { id: "hd_rice_omori",           name: "ライス大盛",             category: "単品", price: 280, tags: [] },
    { id: "hd_annin_tofu",           name: "杏仁豆腐",               category: "単品", price: 180, tags: ["デザート", "店舗限定"] },
    // チャーハン系
    { id: "hd_han_chahan",           name: "半チャーハン",           category: "単品", price: 300, tags: [] },
    { id: "hd_chahan",               name: "チャーハン",             category: "単品", price: 530, tags: ["定番"] },
    { id: "hd_chahan_omori",         name: "チャーハン大盛",         category: "単品", price: 650, tags: [] },
    { id: "hd_yakitori_don",         name: "やきとり丼",             category: "単品", price: 320, tags: [] },
    // 野菜炒め系
    { id: "hd_yasai_itame_tan",      name: "野菜炒め単品",           category: "単品", price: 470, tags: ["野菜"] },
    { id: "hd_niku_yasai_tan",       name: "肉野菜炒め単品",         category: "単品", price: 610, tags: ["肉", "野菜"] }, // ↑野菜炒めのX+α
    { id: "hd_nira_reba_tan",        name: "ニラレバ炒め単品",       category: "単品", price: 580, tags: ["レバー"] },
    { id: "hd_bakudan_tan",          name: "バクダン炒め単品",       category: "単品", price: 600, tags: ["辛い"] },
    { id: "hd_shogayaki_tan",        name: "生姜焼き単品",           category: "単品", price: 620, tags: ["肉"] },
    { id: "hd_w_dragon_tan",         name: "Wドラゴンチキン",        category: "単品", price: 620, tags: ["辛い"] },
    { id: "hd_karaage_tan",          name: "唐揚げ単品",             category: "単品", price: 640, tags: ["揚げ物"] },
    // キムチ炒飯系
    { id: "hd_kimchi_chahan",        name: "キムチ炒飯",             category: "単品", price: 670, tags: ["店舗限定", "辛い"] },
    { id: "hd_kimchi_chahan_omori",  name: "キムチ炒飯大盛り",       category: "単品", price: 790, tags: ["店舗限定", "辛い"] },
    // 中華丼系
    { id: "hd_chuka_don",            name: "中華丼",                 category: "単品", price: 680, tags: ["店舗限定"] },
    { id: "hd_chuka_don_omori",      name: "中華丼大盛",             category: "単品", price: 790, tags: ["店舗限定"] },

    // ──── おつまみ（安い順、X→X+αをまとめて隣接）────
    // 餃子系
    { id: "hd_gyoza_3",              name: "餃子（3個）",            category: "おつまみ", price: 160, tags: ["定番"] },
    { id: "hd_gyoza_6",              name: "餃子（6個）",            category: "おつまみ", price: 300, tags: ["定番", "人気"] }, // ↑餃子3個のX+α
    { id: "hd_menma",                name: "中華風味付けメンマ",     category: "おつまみ", price: 170, tags: [] },
    { id: "hd_mentaiko_potato",      name: "明太子ポテトサラダ",     category: "おつまみ", price: 180, tags: [] },
    { id: "hd_hiyayakko",            name: "冷奴",                   category: "おつまみ", price: 200, tags: [] },
    { id: "hd_sunagimo",             name: "コリ旨！砂肝",           category: "おつまみ", price: 210, tags: [] },
    { id: "hd_zasai",                name: "ザーサイ",               category: "おつまみ", price: 210, tags: [] },
    { id: "hd_hakusai_kimchi",       name: "白菜キムチ",             category: "おつまみ", price: 220, tags: ["辛い"] },
    { id: "hd_yakitori_negi",        name: "やきとり（ネギ和え）",   category: "おつまみ", price: 220, tags: [] },
    { id: "hd_edamame",              name: "枝豆",                   category: "おつまみ", price: 220, tags: [] },
    { id: "hd_soramame",             name: "そら豆",                 category: "おつまみ", price: 220, tags: [] },
    { id: "hd_macaroni_salad",       name: "マカロニサラダ",         category: "おつまみ", price: 240, tags: [] },
    { id: "hd_hokkaido_korokke",     name: "北海道産コロッケ",       category: "おつまみ", price: 270, tags: ["揚げ物"] },
    { id: "hd_tomorokoshi",          name: "とうもろこしの香り揚げ", category: "おつまみ", price: 270, tags: ["揚げ物"] },
    { id: "hd_iwashi_fry",           name: "イワシフライ",           category: "おつまみ", price: 280, tags: ["揚げ物"] },
    { id: "hd_potato_fry",           name: "皮付きポテトフライ",     category: "おつまみ", price: 290, tags: ["揚げ物"] },
    { id: "hd_cheese_maki",          name: "チーズ巻き",             category: "おつまみ", price: 300, tags: [] },
    { id: "hd_kimchi_chashumen",     name: "キムチャーシュー",       category: "おつまみ", price: 300, tags: ["辛い"] },
    { id: "hd_arabiki_winner",       name: "粗挽きウィンナー",       category: "おつまみ", price: 300, tags: [] },
    { id: "hd_karaage_otsu",         name: "おつまみ唐揚げ",         category: "おつまみ", price: 310, tags: ["揚げ物"] },
    { id: "hd_dragon_chicken",       name: "ドラゴンチキン",         category: "おつまみ", price: 330, tags: ["辛い"] },
    { id: "hd_ika_age",              name: "イカ揚げ",               category: "おつまみ", price: 330, tags: ["揚げ物"] },
    { id: "hd_gomoku_harumaki",      name: "五目春巻き",             category: "おつまみ", price: 340, tags: ["揚げ物"] },
    { id: "hd_sanpin_mori",          name: "三品盛合わせ",           category: "おつまみ", price: 370, tags: [] },
    { id: "hd_negi_chashumen_otsu",  name: "おつまみネギチャーシュー", category: "おつまみ", price: 370, tags: [] },

    // ──── トッピング（安い順）────
    { id: "hd_top_karamiso",         name: "秘伝の辛みそ",           category: "トッピング", price: 30,  tags: ["辛い"] },
    { id: "hd_top_meshi_omori",      name: "飯大盛",                 category: "トッピング", price: 70,  tags: [] },
    { id: "hd_top_men_omori",        name: "麺大盛",                 category: "トッピング", price: 80,  tags: [] },
    { id: "hd_top_butter",           name: "バター",                 category: "トッピング", price: 120, tags: [] },
    { id: "hd_top_onsen_tamago",     name: "温泉玉子",               category: "トッピング", price: 120, tags: [] },
    { id: "hd_top_ajitama",          name: "味付け玉子",             category: "トッピング", price: 120, tags: [] },
    { id: "hd_top_negi",             name: "細切りネギ",             category: "トッピング", price: 150, tags: [] },
    { id: "hd_top_menma",            name: "メンマ",                 category: "トッピング", price: 170, tags: [] },
    { id: "hd_top_chashumen_3",      name: "チャーシュー（3枚）",    category: "トッピング", price: 330, tags: [] },
  ],
};

export default hidakaya;
