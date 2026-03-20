import type { Restaurant } from "../types";

const saizeriya: Restaurant = {
  id: "saizeriya",
  name: "サイゼリヤ",
  categories: ["主食", "おかず", "サラダ/前菜", "サイド", "デザート"],
  defaultTargets: { budget: 1000 },
  items: [
    // ──── 主食 ────
    {
      id: "sz_milan_doria",
      name: "ミラノ風ドリア",
      category: "主食",
      price: 300,
      tags: ["定番"],
    },
    {
      id: "sz_baked_cheese_milan",
      name: "焼きチーズミラノ風ドリア",
      category: "主食",
      price: 350,
      tags: ["チーズ"],
    },
    {
      id: "sz_soft_egg_milan",
      name: "半熟卵のミラノ風ドリア",
      category: "主食",
      price: 350,
      tags: ["卵"],
    },
    {
      id: "sz_carbonara",
      name: "カルボナーラ（半熟卵のせ）",
      category: "主食",
      price: 500,
      tags: ["パスタ"],
    },
    {
      id: "sz_spinach_mushroom_cream",
      name: "きのことほうれん草のクリームスパゲッティ",
      category: "主食",
      price: 600,
      tags: ["パスタ"],
    },
    {
      id: "sz_bolognese",
      name: "ミートソース",
      category: "主食",
      price: 400,
      tags: ["パスタ"],
    },
    {
      id: "sz_margherita",
      name: "マルゲリータピザ",
      category: "主食",
      price: 400,
      tags: ["ピザ"],
    },
    {
      id: "sz_veggie_pizza",
      name: "野菜とキノコのピザ",
      category: "主食",
      price: 400,
      tags: ["ピザ", "野菜"],
    },
    {
      id: "sz_cheese_focaccia",
      name: "チーズフォッカチオ",
      category: "主食",
      price: 250,
      tags: ["パン"],
    },
    {
      id: "sz_garlic_focaccia",
      name: "ガーリックフォッカチオ",
      category: "主食",
      price: 200,
      tags: ["パン"],
    },

    // ──── おかず ────
    {
      id: "sz_spicy_chicken",
      name: "辛味チキン",
      category: "おかず",
      price: 300,
      tags: ["人気"],
    },
    {
      id: "sz_diavola_chicken",
      name: "若鶏のディアボラ風",
      category: "おかず",
      price: 500,
      tags: ["肉", "スパイス"],
    },
    {
      id: "sz_cheese_chicken",
      name: "柔らかチキンのチーズ焼き",
      category: "おかず",
      price: 500,
      tags: ["肉", "チーズ"],
    },

    // ──── サラダ/前菜 ────
    {
      id: "sz_ebi_salad",
      name: "小エビのサラダ",
      category: "サラダ/前菜",
      price: 350,
      tags: ["サラダ"],
    },
    {
      id: "sz_spinach_saute",
      name: "ほうれん草のソテー",
      category: "サラダ/前菜",
      price: 200,
      tags: ["野菜"],
    },
    {
      id: "sz_green_peas",
      name: "柔らか青豆の温サラダ",
      category: "サラダ/前菜",
      price: 200,
      tags: ["野菜"],
    },

    // ──── デザート ────
    {
      id: "sz_tiramisu",
      name: "ティラミス",
      category: "デザート",
      price: 300,
      tags: ["スイーツ"],
    },
    {
      id: "sz_truffle_ice",
      name: "トリフアイスクリーム",
      category: "デザート",
      price: 350,
      tags: ["スイーツ"],
    },
  ],
};

export default saizeriya;
