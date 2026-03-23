import type { Restaurant } from "../types";

// 価格はすべて税込・2025〜2026年時点の公式メニューに基づく
// 一部店舗限定メニューや期間限定品は除外しています

const hidakaya: Restaurant = {
  id: "hidakaya",
  name: "日高屋",
  categories: ["セット", "定食", "ラーメン", "単品", "おつまみ", "トッピング"],
  defaultTargets: { budget: 1000 },

  // セットカテゴリを表形式で表示する設定
  // ★ 列順は値段の安い順: 中華そば → とんこつ → 味噌 → タンメン
  setTable: {
    category: "セット",
    cols: ["中華そば", "とんこつ", "味噌", "タンメン"],
    colTags: ["chuka", "tonkotsu", "miso", "tanmen"],
    rows: ["半チャーハン", "焼き鳥丼", "餃子", "半チャーハン+餃子3個", "半チャーハン+餃子6個", "焼き鳥丼+餃子3個", "焼き鳥丼+餃子6個"],
    rowTags: ["hancyahan", "yakitori", "gyoza", "hancyahan_gyoza3", "hancyahan_gyoza6", "yakitori_gyoza3", "yakitori_gyoza6"],
  },

  items: [
    // ──── セット（28種 + ラ・餃・チャ） ────
    // ※ セットのタグ体系（ramen:xxx, side:xxx）はテーブルUIと連動しているため変更禁止
    // 半チャーハン × 4種
    { id: "hd_set_chuka_han",    name: "中華そば＋半チャーハンセット",      category: "セット", price: 710,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["chuka",    "hancyahan"],       image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/f82a2b78-141e-4f04-9df2-4e7a10a728df" },
    { id: "hd_set_tonko_han",    name: "とんこつ＋半チャーハンセット",      category: "セット", price: 800,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["tonkotsu", "hancyahan"],       image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/4f696911-e86c-46ef-b0ec-3bcd4e1b25de" },
    { id: "hd_set_tanmen_han",   name: "タンメン＋半チャーハンセット",      category: "セット", price: 910,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["tanmen",   "hancyahan"],       image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/4e8dfd22-e1e8-45ef-9429-dbf74020905e" },
    { id: "hd_set_miso_han",     name: "味噌ラーメン＋半チャーハンセット",  category: "セット", price: 900,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["miso",     "hancyahan"],       image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/178b7242-af87-4851-a46d-b5358e462328" },
    // 焼き鳥丼 × 4種
    { id: "hd_set_chuka_yaki",   name: "中華そば＋焼き鳥丼セット",          category: "セット", price: 730,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["chuka",    "yakitori"],        image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/d6b73660-86f3-45c9-85c2-ec19592e2962" },
    { id: "hd_set_tonko_yaki",   name: "とんこつ＋焼き鳥丼セット",          category: "セット", price: 820,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["tonkotsu", "yakitori"],        image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/f29b45ba-a9a6-4828-8ef7-cbad8619890c" },
    { id: "hd_set_tanmen_yaki",  name: "タンメン＋焼き鳥丼セット",          category: "セット", price: 930,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["tanmen",   "yakitori"],        image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/7c446dcb-5bee-4a04-b37b-0bdc4fbe43d9" },
    { id: "hd_set_miso_yaki",    name: "味噌ラーメン＋焼き鳥丼セット",      category: "セット", price: 920,  tags: ["セット", "ラーメン", "ご飯"],          setCell: ["miso",     "yakitori"],        image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/a9b3f59e-a4d1-497c-b70e-69702690fcf1" },
    // 餃子 × 4種
    { id: "hd_set_chuka_gyo",    name: "中華そば＋餃子セット",              category: "セット", price: 700,  tags: ["セット", "ラーメン", "餃子"],          setCell: ["chuka",    "gyoza"],           image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/3b215987-686d-49b0-a609-37e68fe47b34" },
    { id: "hd_set_tonko_gyo",    name: "とんこつ＋餃子セット",              category: "セット", price: 790,  tags: ["セット", "ラーメン", "餃子"],          setCell: ["tonkotsu", "gyoza"],           image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/485a7b06-e893-4597-8327-2f31d5deca8c" },
    { id: "hd_set_tanmen_gyo",   name: "タンメン＋餃子セット",              category: "セット", price: 900,  tags: ["セット", "ラーメン", "餃子"],          setCell: ["tanmen",   "gyoza"],           image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/9c3c4fa8-0650-480f-b069-5f3ebd55327b" },
    { id: "hd_set_miso_gyo",     name: "味噌ラーメン＋餃子セット",          category: "セット", price: 890,  tags: ["セット", "ラーメン", "餃子"],          setCell: ["miso",     "gyoza"],           image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c5b1b6e0-2c77-444e-9da9-94d2cba52e9b" },
    // 半チャーハン+餃子3個 × 4種
    { id: "hd_set_chuka_hg3",    name: "中華そば＋半チャーハン＋餃子3個セット",      category: "セット", price: 860,  tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["chuka",    "hancyahan_gyoza3"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/845575e7-6c4a-40f1-814c-2e8461f36c11" },
    { id: "hd_set_tonko_hg3",    name: "とんこつ＋半チャーハン＋餃子3個セット",      category: "セット", price: 950,  tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tonkotsu", "hancyahan_gyoza3"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/fc8c84d3-40ae-43e8-ac39-991d7f85e6d8" },
    { id: "hd_set_tanmen_hg3",   name: "タンメン＋半チャーハン＋餃子3個セット",      category: "セット", price: 1060, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tanmen",   "hancyahan_gyoza3"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cddc42fd-7b3b-4084-9274-f7a41e696a3e" },
    { id: "hd_set_miso_hg3",     name: "味噌ラーメン＋半チャーハン＋餃子3個セット",  category: "セット", price: 1050, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["miso",     "hancyahan_gyoza3"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/49858d1a-4025-45ae-b300-6d1fac4eba78" },
    // 半チャーハン+餃子6個 × 4種
    { id: "hd_set_chuka_hg6",    name: "中華そば＋半チャーハン＋餃子6個セット",      category: "セット", price: 990,  tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["chuka",    "hancyahan_gyoza6"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/0ab491ad-3303-4e54-b496-d4d56d5cb56a" },
    { id: "hd_set_tonko_hg6",    name: "とんこつ＋半チャーハン＋餃子6個セット",      category: "セット", price: 1080, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tonkotsu", "hancyahan_gyoza6"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/26217e02-a35e-4903-b1c5-ba3155515ac0" },
    { id: "hd_set_tanmen_hg6",   name: "タンメン＋半チャーハン＋餃子6個セット",      category: "セット", price: 1190, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tanmen",   "hancyahan_gyoza6"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/324f03a2-986c-4d27-86b1-4d3fa867bc94" },
    { id: "hd_set_miso_hg6",     name: "味噌ラーメン＋半チャーハン＋餃子6個セット",  category: "セット", price: 1180, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["miso",     "hancyahan_gyoza6"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/5c27c393-f757-4adb-8955-9407f8243b07" },
    // 焼き鳥丼+餃子3個 × 4種
    { id: "hd_set_chuka_yg3",    name: "中華そば＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 880,  tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["chuka",    "yakitori_gyoza3"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c1b6fe18-506e-4721-b437-163aa8f298d9" },
    { id: "hd_set_tonko_yg3",    name: "とんこつ＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 970,  tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tonkotsu", "yakitori_gyoza3"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/57dba71d-b8d9-4be7-8c3d-427570e7323b" },
    { id: "hd_set_tanmen_yg3",   name: "タンメン＋焼き鳥丼＋餃子3個セット",          category: "セット", price: 1080, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tanmen",   "yakitori_gyoza3"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/8f3c14a4-9b31-43b0-9046-169eb5955002" },
    { id: "hd_set_miso_yg3",     name: "味噌ラーメン＋焼き鳥丼＋餃子3個セット",      category: "セット", price: 1070, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["miso",     "yakitori_gyoza3"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c4d8739f-379c-42a1-919b-4e4cbf1efe14" },
    // 焼き鳥丼+餃子6個 × 4種
    { id: "hd_set_chuka_yg6",    name: "中華そば＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1010, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["chuka",    "yakitori_gyoza6"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e1cfa74d-c51b-46e6-8053-e60edb6cc392" },
    { id: "hd_set_tonko_yg6",    name: "とんこつ＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1100, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tonkotsu", "yakitori_gyoza6"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/4808068c-34a3-4839-8a54-7801a247a9a4" },
    { id: "hd_set_tanmen_yg6",   name: "タンメン＋焼き鳥丼＋餃子6個セット",          category: "セット", price: 1210, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["tanmen",   "yakitori_gyoza6"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/3da4a7c2-8159-4b68-a75c-b11f3175955d" },
    { id: "hd_set_miso_yg6",     name: "味噌ラーメン＋焼き鳥丼＋餃子6個セット",      category: "セット", price: 1200, tags: ["セット", "ラーメン", "ご飯", "餃子"], setCell: ["miso",     "yakitori_gyoza6"],  image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/1c0237fa-dffc-4f49-ac44-6ae2fb175736" },
    // 単独セット
    { id: "hd_ragyo_cha",        name: "半ラ・餃3・半チャのセット",                   category: "セット", price: 690,  tags: ["special", "セット", "ラーメン", "ご飯", "餃子"],                                    image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/dde51586-705c-43ae-8f81-f21abc98060b" },

    // ──── 定食（安い順、X→X+αをまとめて隣接）────
    // タグ: 1つ目=カテゴリ名「定食」、全品に「ご飯」付き、2つ目以降=特徴
    { id: "hd_yasai_itame_set",      name: "野菜炒め定食",               category: "定食", price: 700, tags: ["定食", "ご飯", "野菜", "人気"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/97b15e66-652e-4a28-8940-c7671a8fdb30" },
    { id: "hd_niku_yasai_set",       name: "肉野菜炒め定食",             category: "定食", price: 840, tags: ["定食", "ご飯", "肉", "野菜"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/84184763-f139-40a7-98d0-563ab8d61728" },
    { id: "hd_nira_reba_set",        name: "ニラレバ炒め定食",           category: "定食", price: 810, tags: ["定食", "ご飯", "レバー"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/060c4954-ad22-4f49-88ac-38e4edcfaeab" },
    { id: "hd_bakudan_set",          name: "バクダン炒め定食",           category: "定食", price: 830, tags: ["定食", "ご飯", "辛い", "キムチ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/17287aa4-7972-46fa-a6dc-5fcc5985f18c" },
    { id: "hd_shogayaki_set",        name: "生姜焼き定食",               category: "定食", price: 850, tags: ["定食", "ご飯", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c4184386-d65f-4a91-83ef-560a3861c881" },
    { id: "hd_w_dragon_set",         name: "Wドラゴンチキン定食",        category: "定食", price: 850, tags: ["定食", "ご飯", "辛い", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e1c38fe9-f9fa-4704-bf64-cebab72ac3cc" },
    { id: "hd_w_gyoza_kimchi_set",   name: "W餃子定食（白菜キムチ）",   category: "定食", price: 860, tags: ["定食", "ご飯", "餃子", "揚げ物", "キムチ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/319ee6ca-406c-4687-a3d9-2f6aec9fdb16" },
    { id: "hd_w_gyoza_karaage_set",  name: "W餃子定食（唐揚げ２個）",   category: "定食", price: 860, tags: ["定食", "ご飯", "餃子", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e279c97c-483e-48b5-ad58-40ba3f0909b0" },
    { id: "hd_karaage_set",          name: "唐揚げ定食",                 category: "定食", price: 870, tags: ["定食", "ご飯", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/0c385d20-d552-4354-9047-9a00ea89f63f" },

    // ──── ラーメン（安い順、系統ごとにまとめて隣接）────
    // タグ: 1つ目=「ラーメン」、全品に「麺類」付き、3つ目以降=特徴
    { id: "hd_han_ramen",            name: "半ラーメン",                         category: "ラーメン", price: 240,  tags: ["ラーメン", "麺類"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2e93cc4c-a614-4353-9638-30ab80a4f0af" },
    // 中華そば系
    { id: "hd_chuka_soba",           name: "中華そば",                           category: "ラーメン", price: 420,  tags: ["ラーメン", "麺類", "定番", "人気"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/87d9c6af-c4b8-414a-b870-5a287beab72c" },
    { id: "hd_ajitama_chuka",        name: "味玉中華そば",                       category: "ラーメン", price: 540,  tags: ["ラーメン", "麺類", "定番"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/35b9918f-56d7-459e-a94c-f089fd2aca5b" },
    { id: "hd_chuka_chashumen",      name: "中華チャーシューメン",               category: "ラーメン", price: 750,  tags: ["ラーメン", "麺類"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/d29166e4-7160-465e-982f-c0f46cb0c72f" },
    // とんこつ系
    { id: "hd_tonkotsu",             name: "とんこつラーメン",                   category: "ラーメン", price: 510,  tags: ["ラーメン", "麺類", "とんこつ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/bf029962-784a-4b41-95f4-d6f8198355dc" },
    { id: "hd_ajitama_tonkotsu",     name: "味玉とんこつラーメン",               category: "ラーメン", price: 630,  tags: ["ラーメン", "麺類", "とんこつ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e9c64632-4d6b-4507-ba7a-f3ca467d7de6" },
    { id: "hd_pirika_tonkotsu_negi", name: "ピリ辛とんこつネギラーメン",         category: "ラーメン", price: 680,  tags: ["ラーメン", "麺類", "とんこつ", "辛い"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/0da9c08d-02c3-4029-8aea-bde6ccefd4fc" },
    { id: "hd_tonkotsu_chashumen",   name: "とんこつチャーシューメン",           category: "ラーメン", price: 840,  tags: ["ラーメン", "麺類", "とんこつ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cc8a9ae2-e52c-49bf-adff-5031784aeb25" },
    { id: "hd_pirika_tonkotsu_cha",  name: "ピリ辛とんこつネギチャーシューメン", category: "ラーメン", price: 1010, tags: ["ラーメン", "麺類", "とんこつ", "辛い"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cd47e8bd-0745-4e6f-898d-8c31761983d7" },
    // タンメン系
    { id: "hd_tanmen_sukuname",      name: "野菜たっぷりタンメン（麺少なめ）",  category: "ラーメン", price: 590,  tags: ["ラーメン", "麺類", "野菜"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/8c1b0780-4d90-48fb-8b2c-ec068070aa4f" },
    { id: "hd_tanmen",               name: "野菜たっぷりタンメン",               category: "ラーメン", price: 620,  tags: ["ラーメン", "麺類", "野菜", "人気"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e89f3bad-f976-48a9-b13d-cff55820a5e2" },
    { id: "hd_negi_tower_tanmen",    name: "ネギタワータンメン",                 category: "ラーメン", price: 770,  tags: ["ラーメン", "麺類", "野菜"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2bf9c967-a2e7-48d6-861c-c03c6b0c2332" },
    // 味噌系
    { id: "hd_miso_ramen",           name: "味噌ラーメン",                       category: "ラーメン", price: 610,  tags: ["ラーメン", "麺類", "味噌"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/9812a18b-8bd2-4d75-a6af-0121a59f6608" },
    { id: "hd_karamiso",             name: "秘伝の辛味噌ラーメン",               category: "ラーメン", price: 640,  tags: ["ラーメン", "麺類", "味噌", "辛い"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/de3974a1-cf01-4e72-9ad3-9aac79a2762a" },
    { id: "hd_miso_butter",          name: "味噌バターラーメン",                 category: "ラーメン", price: 730,  tags: ["ラーメン", "麺類", "味噌"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/13f26ae8-b2ae-4a2c-855f-e9cd8bebad0a" },
    { id: "hd_negi_tower_miso",      name: "ネギタワー味噌ラーメン",             category: "ラーメン", price: 760,  tags: ["ラーメン", "麺類", "味噌"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/bfd9a4c2-ee5c-4352-9f13-e736bca16c78" },
    { id: "hd_miso_chashumen",       name: "味噌チャーシューメン",               category: "ラーメン", price: 940,  tags: ["ラーメン", "麺類", "味噌"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/559b7d8c-cbd1-4a4a-a814-1e37e13018b0" },
    { id: "hd_karamiso_chashumen",   name: "秘伝の辛味噌チャーシューメン",       category: "ラーメン", price: 970,  tags: ["ラーメン", "麺類", "味噌", "辛い"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/b9505e0f-e853-4814-8830-bb3167a9a5e6" },
    { id: "hd_negi_tower_miso_cha",  name: "ネギタワー味噌チャーシューメン",     category: "ラーメン", price: 1090, tags: ["ラーメン", "麺類", "味噌"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/142b4199-8eca-4aec-911b-04d66413c871" },
    // その他
    { id: "hd_jiru_nashi",           name: "汁なしラーメン",                     category: "ラーメン", price: 640,  tags: ["ラーメン", "麺類"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2543bfcb-550f-4506-9bc9-bb44ac007449" },
    { id: "hd_gomoku_ankake",        name: "五目あんかけラーメン",               category: "ラーメン", price: 720,  tags: ["ラーメン", "麺類"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2d245245-7d8e-4ba4-8368-fe2968868cd1" },
    { id: "hd_katayakisoba",         name: "カタヤキソバ",                       category: "ラーメン", price: 720,  tags: ["ラーメン", "麺類", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/53e917d7-307f-4eea-973f-d7ce80230e35" },
    { id: "hd_chige_miso",           name: "チゲ味噌ラーメン",                   category: "ラーメン", price: 790,  tags: ["ラーメン", "麺類", "辛い", "期間限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/ea3668b7-39f8-4666-a8a2-966d630ff3c1" },

    // ──── 単品（安い順、X→X+αをまとめて隣接）────
    // タグ: 1つ目=「単品」、2つ目以降=特徴
    { id: "hd_soup",                 name: "スープ",                 category: "単品", price: 20,  tags: ["単品"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/be060427-dc9e-4188-8b7f-8c3d96b7517d" },
    // ライス系
    { id: "hd_han_rice",             name: "半ライス",               category: "単品", price: 150, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c1cd9bad-20c9-48cb-8115-d01cf6444fea" },
    { id: "hd_rice",                 name: "ライス",                 category: "単品", price: 210, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/b7f669df-c410-441f-b206-c9d1b5cbd80c" },
    { id: "hd_rice_set",             name: "ライスセット",           category: "単品", price: 230, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2792a376-6be7-4eb8-b75d-c465e0dc9af7" },
    { id: "hd_rice_omori",           name: "ライス大盛",             category: "単品", price: 280, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/fa9e55c2-8348-4be6-8f20-ed346bac01d1" },
    // チャーハン系
    { id: "hd_han_chahan",           name: "半チャーハン",           category: "単品", price: 300, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/29db9765-c51f-4527-96b4-7133530fde18" },
    { id: "hd_chahan",               name: "チャーハン",             category: "単品", price: 530, tags: ["単品", "ご飯", "定番"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/73365e09-89b0-48fd-82a5-eb607206abe5" },
    { id: "hd_chahan_omori",         name: "チャーハン大盛",         category: "単品", price: 650, tags: ["単品", "ご飯"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/06c176ae-9944-4caa-ae10-75ddb031409f" },
    { id: "hd_yakitori_don",         name: "やきとり丼",             category: "単品", price: 320, tags: ["単品", "ご飯", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/6100849a-842a-40c8-91a5-f8d1b42fa861" },
    // 野菜炒め系
    { id: "hd_yasai_itame_tan",      name: "野菜炒め単品",           category: "単品", price: 470, tags: ["単品", "野菜"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/16a06310-5dec-4d1d-b6ab-eb4f8a01d12e" },
    { id: "hd_niku_yasai_tan",       name: "肉野菜炒め単品",         category: "単品", price: 610, tags: ["単品", "肉", "野菜"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/1306c887-3598-4564-85c4-9994e403b6bc" },
    { id: "hd_nira_reba_tan",        name: "ニラレバ炒め単品",       category: "単品", price: 580, tags: ["単品", "レバー"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/5b588334-23ec-410d-93e5-ad94456fc1f5" },
    { id: "hd_bakudan_tan",          name: "バクダン炒め単品",       category: "単品", price: 600, tags: ["単品", "辛い", "キムチ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/85fa3ba1-72a4-4872-8c47-dd3c31e77493" },
    { id: "hd_shogayaki_tan",        name: "生姜焼き単品",           category: "単品", price: 620, tags: ["単品", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/60b2a2ac-2153-4e7e-829e-723199ec1fa2" },
    { id: "hd_w_dragon_tan",         name: "Wドラゴンチキン",        category: "単品", price: 620, tags: ["単品", "辛い", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/39590cc2-90ca-4a50-a33a-15e367e1205e" },
    { id: "hd_karaage_tan",          name: "唐揚げ単品",             category: "単品", price: 640, tags: ["単品", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/53180781-5334-40ee-b986-a33ee095d1fd" },
    // キムチ炒飯系
    { id: "hd_kimchi_chahan",        name: "キムチ炒飯",             category: "単品", price: 670, tags: ["単品", "ご飯", "辛い", "キムチ", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/7421d291-58e3-4afc-8930-42dd4450fae3" },
    { id: "hd_kimchi_chahan_omori",  name: "キムチ炒飯大盛り",       category: "単品", price: 790, tags: ["単品", "ご飯", "辛い", "キムチ", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/9f7312f0-89f9-430e-b636-a26a4c5a2571" },
    // 中華丼系
    { id: "hd_chuka_don",            name: "中華丼",                 category: "単品", price: 680, tags: ["単品", "ご飯", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/68daf6c7-3fae-4bf9-a515-585edb679d76" },
    { id: "hd_chuka_don_omori",      name: "中華丼大盛",             category: "単品", price: 790, tags: ["単品", "ご飯", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/56a3f355-4261-4c64-adaa-a9a02af6bbf5" },
    { id: "hd_annin_tofu",           name: "杏仁豆腐",               category: "単品", price: 180, tags: ["単品", "デザート", "店舗限定"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/ffc93a1e-1d28-4559-b38d-ed153d7e251a" },

    // ──── おつまみ（安い順、X→X+αをまとめて隣接）────
    // タグ: 1つ目=「おつまみ」、2つ目以降=特徴
    // 餃子系
    { id: "hd_gyoza_3",              name: "餃子（3個）",            category: "おつまみ", price: 160, tags: ["おつまみ", "定番"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/965cce39-bc1f-48db-b762-bef660a952bf" },
    { id: "hd_gyoza_6",              name: "餃子（6個）",            category: "おつまみ", price: 300, tags: ["おつまみ", "定番", "人気"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c7d234d3-ce9f-492d-9326-ea87cde2ed64" },
    { id: "hd_menma",                name: "中華風味付けメンマ",     category: "おつまみ", price: 170, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/e159a7b4-e1d2-44d0-b154-7b0b614a8ea1" },
    { id: "hd_mentaiko_potato",      name: "明太子ポテトサラダ",     category: "おつまみ", price: 180, tags: ["おつまみ", "サラダ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cecb7c40-bdc3-4855-a773-a02de2c01d4c" },
    { id: "hd_hiyayakko",            name: "冷奴",                   category: "おつまみ", price: 200, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/1a5df6d9-fd89-4175-a217-3d91ce4eaf7c" },
    { id: "hd_sunagimo",             name: "コリ旨！砂肝",           category: "おつまみ", price: 210, tags: ["おつまみ", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/2af47b67-f5f0-4a75-9004-d1715c233dc8" },
    { id: "hd_zasai",                name: "ザーサイ",               category: "おつまみ", price: 210, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/ae3c235e-ce2d-4b44-9b2a-fd5116f8afe6" },
    { id: "hd_hakusai_kimchi",       name: "白菜キムチ",             category: "おつまみ", price: 220, tags: ["おつまみ", "辛い", "キムチ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/b13c0a9e-1b4d-443b-a1bf-abe602039206" },
    { id: "hd_yakitori_negi",        name: "やきとり（ネギ和え）",   category: "おつまみ", price: 220, tags: ["おつまみ", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/8d2074f9-f203-415b-b20d-c30c39a92ea3" },
    { id: "hd_edamame",              name: "枝豆",                   category: "おつまみ", price: 220, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/57c186a6-3b96-4867-800b-c8c5b1761ef7" },
    { id: "hd_soramame",             name: "そら豆",                 category: "おつまみ", price: 220, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/3496d283-76fc-45f6-86e4-58f8a0399868" },
    { id: "hd_macaroni_salad",       name: "マカロニサラダ",         category: "おつまみ", price: 240, tags: ["おつまみ", "サラダ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/234dcf57-2146-4a1a-bb88-022738ceef1b" },
    { id: "hd_hokkaido_korokke",     name: "北海道産コロッケ",       category: "おつまみ", price: 270, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/6e4d2a24-ecfc-4b79-9e25-6714771a1c8d" },
    { id: "hd_tomorokoshi",          name: "とうもろこしの香り揚げ", category: "おつまみ", price: 270, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/1a9a00d2-4e50-4890-8b3d-3abcf539a221" },
    { id: "hd_iwashi_fry",           name: "イワシフライ",           category: "おつまみ", price: 280, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cf090b90-e8d7-48cf-9c64-7ea15040163d" },
    { id: "hd_potato_fry",           name: "皮付きポテトフライ",     category: "おつまみ", price: 290, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/97e97946-7fdb-4e02-a8c4-da0af5e8c9a2" },
    { id: "hd_cheese_maki",          name: "チーズ巻き",             category: "おつまみ", price: 300, tags: ["おつまみ", "チーズ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/fa16e016-02c4-4e14-8d35-15c1ec2c9cb6" },
    { id: "hd_kimchi_chashumen",     name: "キムチャーシュー",       category: "おつまみ", price: 300, tags: ["おつまみ", "辛い", "肉", "キムチ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/46502472-62f5-4d7d-b1fa-9f1183151781" },
    { id: "hd_arabiki_winner",       name: "粗挽きウィンナー",       category: "おつまみ", price: 300, tags: ["おつまみ", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/644de49b-b29f-42b7-b2d5-5ba8fd21af94" },
    { id: "hd_karaage_otsu",         name: "おつまみ唐揚げ",         category: "おつまみ", price: 310, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/5aae27b2-32b8-4562-bc98-e72635ffa99f" },
    { id: "hd_dragon_chicken",       name: "ドラゴンチキン",         category: "おつまみ", price: 330, tags: ["おつまみ", "辛い", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/768a9f42-47e7-4fde-8f18-80c936c5e380" },
    { id: "hd_ika_age",              name: "イカ揚げ",               category: "おつまみ", price: 330, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/8ef8a064-a16e-49b8-9434-62d5014780f2" },
    { id: "hd_gomoku_harumaki",      name: "五目春巻き",             category: "おつまみ", price: 340, tags: ["おつまみ", "揚げ物"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c1e87a08-abd3-4fd1-b15a-bcd8d19b3789" },
    { id: "hd_sanpin_mori",          name: "三品盛合わせ",           category: "おつまみ", price: 370, tags: ["おつまみ"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/c458aebc-5c71-40d2-bad4-491cfe491e49" },
    { id: "hd_negi_chashumen_otsu",  name: "おつまみネギチャーシュー", category: "おつまみ", price: 370, tags: ["おつまみ", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/19892d6c-ef9f-4c08-b616-016d45ef78ee" },

    // ──── トッピング（安い順）────
    // タグ: 1つ目=「トッピング」、2つ目以降=特徴
    { id: "hd_top_karamiso",         name: "秘伝の辛みそ",           category: "トッピング", price: 30,  tags: ["トッピング", "辛い"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/aa14fc16-b3a7-430b-9e76-a20b10ec5b2f" },
    { id: "hd_top_meshi_omori",      name: "飯大盛",                 category: "トッピング", price: 70,  tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/7787a44e-ce62-4dab-9f1e-c71a15f99563" },
    { id: "hd_top_men_omori",        name: "麺大盛",                 category: "トッピング", price: 80,  tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/97f149b3-1b9e-4b07-8214-8fb87e72c25a" },
    { id: "hd_top_butter",           name: "バター",                 category: "トッピング", price: 120, tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/8722cea5-73b4-4b57-a420-99e188e738ec" },
    { id: "hd_top_onsen_tamago",     name: "温泉玉子",               category: "トッピング", price: 120, tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/03e7d220-0c42-455c-ab73-4c84ba79db4e" },
    { id: "hd_top_ajitama",          name: "味付け玉子",             category: "トッピング", price: 120, tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/70994420-e5d5-4462-92f8-77c4e93bef8e" },
    { id: "hd_top_negi",             name: "細切りネギ",             category: "トッピング", price: 150, tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/5f4c1e89-5519-403e-99a3-1eca89fbcd08" },
    { id: "hd_top_menma",            name: "メンマ",                 category: "トッピング", price: 170, tags: ["トッピング"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/3fbda4c1-2886-42a3-841f-914f472be127" },
    { id: "hd_top_chashumen_3",      name: "チャーシュー（3枚）",    category: "トッピング", price: 330, tags: ["トッピング", "肉"], image: "https://hidakaya.hiday.co.jp/hits/outimages/picture/cfa997ef-9cec-42d0-adbc-c3ccc0cade5b" },
  ],
  tagOrder: [
    "人気", "定番", "麺類", "ご飯", "肉", "野菜", "セット", "定食", "ラーメン", "おつまみ",
    "餃子", "単品", "辛い", "揚げ物", "トッピング", "キムチ", "味噌", "店舗限定", "とんこつ", "レバー", "サラダ", "期間限定", "デザート", "チーズ",
  ],
  // カテゴリ別トッピングショートカット（麺大盛+80円 / 飯大盛+70円）
  categoryAddons: {
    "ラーメン": ["hd_top_men_omori"],
    "定食":     ["hd_top_meshi_omori"],
    "セット":   ["hd_top_men_omori", "hd_top_meshi_omori"],
  },
};

export default hidakaya;
