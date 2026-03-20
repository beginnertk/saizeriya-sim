import type { Restaurant } from "../types";

// 価格はすべて税込・2025〜2026年時点の公式メニューに基づく
// 一部店舗限定メニューや期間限定品は除外しています

const hidakaya: Restaurant = {
  id: "hidakaya",
  name: "日高屋",
  categories: ["ラーメン", "定食", "飯物", "一品料理", "セット"],
  defaultTargets: { budget: 1000 },
  items: [
    // ──── ラーメン ────
    {
      id: "hd_chuka_soba",
      name: "中華そば",
      category: "ラーメン",
      price: 420,
      tags: ["定番", "人気"],
    },
    {
      id: "hd_chuka_soba_omori",
      name: "中華そば大盛",
      category: "ラーメン",
      price: 500,
      tags: ["定番"],
    },
    {
      id: "hd_ajitama_chuka",
      name: "味玉中華そば",
      category: "ラーメン",
      price: 540,
      tags: ["定番"],
    },
    {
      id: "hd_tanmen",
      name: "野菜たっぷりタンメン",
      category: "ラーメン",
      price: 620,
      tags: ["野菜", "人気"],
    },
    {
      id: "hd_miso_ramen",
      name: "味噌ラーメン",
      category: "ラーメン",
      price: 610,
      tags: ["味噌"],
    },
    {
      id: "hd_tonkotsu",
      name: "とんこつラーメン",
      category: "ラーメン",
      price: 510,
      tags: ["とんこつ"],
    },
    {
      id: "hd_niku_nira_ramen",
      name: "肉ニラらーめん",
      category: "ラーメン",
      price: 790,
      tags: ["辛い"],
    },

    // ──── 定食 ────
    {
      id: "hd_yasai_itame_set",
      name: "野菜炒め定食",
      category: "定食",
      price: 700,
      tags: ["野菜", "人気"],
    },
    {
      id: "hd_shogayaki_set",
      name: "生姜焼き定食",
      category: "定食",
      price: 850,
      tags: ["肉"],
    },
    {
      id: "hd_nira_reba_set",
      name: "ニラレバ炒め定食",
      category: "定食",
      price: 790,
      tags: ["レバー"],
    },
    {
      id: "hd_bakudan_set",
      name: "バクダン炒め定食",
      category: "定食",
      price: 790,
      tags: ["辛い"],
    },
    {
      id: "hd_double_gyoza_set",
      name: "ダブル餃子定食",
      category: "定食",
      price: 710,
      tags: ["餃子"],
    },

    // ──── 飯物 ────
    {
      id: "hd_chahan",
      name: "チャーハン",
      category: "飯物",
      price: 530,
      tags: ["定番"],
    },
    {
      id: "hd_chahan_omori",
      name: "チャーハン大盛",
      category: "飯物",
      price: 650,
      tags: [],
    },
    {
      id: "hd_chuka_don",
      name: "中華丼",
      category: "飯物",
      price: 680,
      tags: [],
    },
    {
      id: "hd_rice",
      name: "ライス",
      category: "飯物",
      price: 210,
      tags: [],
    },

    // ──── 一品料理 ────
    {
      id: "hd_gyoza",
      name: "餃子（6個）",
      category: "一品料理",
      price: 300,
      tags: ["定番", "人気"],
    },
    {
      id: "hd_karaage_3",
      name: "おつまみ唐揚げ（3個）",
      category: "一品料理",
      price: 310,
      tags: ["揚げ物"],
    },
    {
      id: "hd_yasai_itame",
      name: "野菜炒め",
      category: "一品料理",
      price: 490,
      tags: ["野菜"],
    },
    {
      id: "hd_nira_reba",
      name: "ニラレバ炒め",
      category: "一品料理",
      price: 590,
      tags: ["レバー"],
    },

    // ──── セット ────
    {
      id: "hd_ra_gyo_cha",
      name: "ラ・餃・チャセット",
      category: "セット",
      price: 690,
      tags: ["人気", "お得"],
    },
    {
      id: "hd_tenshinhan_set",
      name: "天津飯セット",
      category: "セット",
      price: 860,
      tags: ["お得"],
    },
  ],
};

export default hidakaya;
