import type { Restaurant } from "../types";

// 価格・メニューはユーザー提供のメニュー表転記に基づく（画像URLなし・公式サイトなし）

const takemura: Restaurant = {
  id: "takemura",
  name: "中華そば 竹むら",
  categories: ["麺", "トッピング", "ご飯もの"],
  defaultTargets: { budget: 1200 },
  tagOrder: [],

  // 麺カテゴリを表形式で表示する設定
  // 列 = 味付けバリエーション（並・特製・焼豚・味玉）、行 = ラーメンの種類
  setTable: {
    category: "麺",
    cols: ["並", "特製", "焼豚", "味玉"],
    colTags: ["nami", "tokusei", "yakibuta", "ajitama"],
    rows: ["中華そば", "あご煮干しそば", "つけ麺", "濃厚煮干つけ麺"],
    rowTags: ["chuka", "ago", "tsukemen", "noukou"],
  },

  items: [
    // ──── 麺（並・特製・焼豚・味玉 × 4種）────
    { id: "tk_chuka_nami", name: "中華そば", category: "麺", price: 900, setCell: ["nami", "chuka"] },
    { id: "tk_chuka_tokusei", name: "特製中華そば", category: "麺", price: 1200, setCell: ["tokusei", "chuka"] },
    { id: "tk_chuka_yakibuta", name: "焼豚中華そば", category: "麺", price: 1100, setCell: ["yakibuta", "chuka"] },
    { id: "tk_chuka_ajitama", name: "味玉中華そば", category: "麺", price: 1000, setCell: ["ajitama", "chuka"] },

    { id: "tk_ago_nami", name: "あご煮干しそば", category: "麺", price: 1000, setCell: ["nami", "ago"] },
    { id: "tk_ago_tokusei", name: "特製あご煮干しそば", category: "麺", price: 1300, setCell: ["tokusei", "ago"] },
    { id: "tk_ago_yakibuta", name: "焼豚あご煮干しそば", category: "麺", price: 1200, setCell: ["yakibuta", "ago"] },
    { id: "tk_ago_ajitama", name: "味玉あご煮干しそば", category: "麺", price: 1100, setCell: ["ajitama", "ago"] },

    { id: "tk_tsukemen_nami", name: "つけ麺", category: "麺", price: 950, setCell: ["nami", "tsukemen"] },
    { id: "tk_tsukemen_tokusei", name: "特製つけ麺", category: "麺", price: 1250, setCell: ["tokusei", "tsukemen"] },
    { id: "tk_tsukemen_yakibuta", name: "焼豚つけ麺", category: "麺", price: 1150, setCell: ["yakibuta", "tsukemen"] },
    { id: "tk_tsukemen_ajitama", name: "味玉つけ麺", category: "麺", price: 1050, setCell: ["ajitama", "tsukemen"] },

    { id: "tk_noukou_nami", name: "濃厚煮干つけ麺", category: "麺", price: 1100, setCell: ["nami", "noukou"] },
    { id: "tk_noukou_tokusei", name: "特製濃厚煮干つけ麺", category: "麺", price: 1400, setCell: ["tokusei", "noukou"] },
    { id: "tk_noukou_yakibuta", name: "焼豚濃厚煮干つけ麺", category: "麺", price: 1300, setCell: ["yakibuta", "noukou"] },
    { id: "tk_noukou_ajitama", name: "味玉濃厚煮干つけ麺", category: "麺", price: 1200, setCell: ["ajitama", "noukou"] },

    // ──── トッピング ────
    { id: "tk_top_ajitama", name: "味玉", category: "トッピング", price: 130 },
    { id: "tk_top_nori", name: "海苔", category: "トッピング", price: 150 },
    { id: "tk_top_menma", name: "メンマ", category: "トッピング", price: 100 },
    { id: "tk_top_kujonegi", name: "九条ネギ", category: "トッピング", price: 200 },
    { id: "tk_top_chashu", name: "チャーシュー", category: "トッピング", price: 250 },

    // ──── ご飯もの ────
    { id: "tk_rice_hakumai", name: "白飯", category: "ご飯もの", price: 150 },
    { id: "tk_rice_ichiya_tkg", name: "一夜漬けTKG", category: "ご飯もの", price: 350 },
    { id: "tk_rice_tororo", name: "とろろご飯", category: "ご飯もの", price: 350 },
    { id: "tk_rice_aburi_chashu_don", name: "炙りチャーシュー丼", category: "ご飯もの", price: 400 },
  ],
};

export default takemura;
