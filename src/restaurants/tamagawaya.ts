import type { Restaurant } from "../types";

// 価格は公式サイト（https://www.wagashi-tamagawaya.com/menu）の税込表記に基づく
// 画像は公式サイト上のURLを直リンク参照（ダウンロード・同梱はしない）
// 除外品: 価格未記載品（栗きんとん・紅白饅頭）、販売休止中品（花見団子・チョコレート饅頭）、
//         重量で価格変動する品（蓮の上・蓮の葉入り）、慶弔用のお赤飯（別価格のため対象外）

const tamagawaya: Restaurant = {
  id: "tamagawaya",
  name: "玉川屋",
  categories: ["年間", "春", "夏", "秋", "冬", "お彼岸・お盆", "慶弔"],
  defaultTargets: { budget: 1000 },
  tagOrder: [],

  items: [
    // ──── 年間の和菓子 ────
    { id: "tg_niou_1", name: "仁王餅（一個）", category: "年間", price: 180, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/cd198699.JPG", period: "通年" },
    { id: "tg_niou_3", name: "仁王餅（三個入）", category: "年間", price: 570, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/cd198699.JPG", period: "通年" },
    { id: "tg_niou_6", name: "仁王餅（六個入）", category: "年間", price: 1150, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/cd198699.JPG", period: "通年" },
    { id: "tg_niou_10", name: "仁王餅（十個入）", category: "年間", price: 1920, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/cd198699.JPG", period: "通年" },

    { id: "tg_butter_dora_1", name: "バターどら焼き（一個）", category: "年間", price: 250, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/620c352f.JPG", period: "通年" },
    { id: "tg_butter_dora_6", name: "バターどら焼き（六個入）", category: "年間", price: 1740, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/620c352f.JPG", period: "通年" },
    { id: "tg_butter_dora_10", name: "バターどら焼き（十個入）", category: "年間", price: 2740, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/620c352f.JPG", period: "通年" },
    { id: "tg_butter_dora_15", name: "バターどら焼き（十五個入）", category: "年間", price: 3990, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/620c352f.JPG", period: "通年" },
    { id: "tg_butter_dora_20", name: "バターどら焼き（二十個入）", category: "年間", price: 5320, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/620c352f.JPG", period: "通年" },

    { id: "tg_kokuto_dora_1", name: "黒糖どら焼き（一個）", category: "年間", price: 250, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d6fa816a.JPG", period: "通年" },
    { id: "tg_kokuto_dora_6", name: "黒糖どら焼き（六個入）", category: "年間", price: 1740, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d6fa816a.JPG", period: "通年" },
    { id: "tg_kokuto_dora_10", name: "黒糖どら焼き（十個入）", category: "年間", price: 2740, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d6fa816a.JPG", period: "通年" },
    { id: "tg_kokuto_dora_15", name: "黒糖どら焼き（十五個入）", category: "年間", price: 3990, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d6fa816a.JPG", period: "通年" },
    { id: "tg_kokuto_dora_20", name: "黒糖どら焼き（二十個入）", category: "年間", price: 5320, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d6fa816a.JPG", period: "通年" },

    { id: "tg_kurifudo_1", name: "栗不動（一個）", category: "年間", price: 260, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/8c727c0e.JPG", period: "通年" },
    { id: "tg_kurifudo_9", name: "栗不動（九個入）", category: "年間", price: 2580, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/8c727c0e.JPG", period: "通年" },
    { id: "tg_kurifudo_12", name: "栗不動（十二個入）", category: "年間", price: 3360, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/8c727c0e.JPG", period: "通年" },
    { id: "tg_kurifudo_16", name: "栗不動（十六個入）", category: "年間", price: 4400, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/8c727c0e.JPG", period: "通年" },

    { id: "tg_meguro_ume", name: "目黒の梅", category: "年間", price: 260, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/9d7f7806.JPG", period: "通年" },
    { id: "tg_kurman", name: "栗まん", category: "年間", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b374be4a.JPG", period: "通年" },
    { id: "tg_azuma_manju", name: "東饅頭", category: "年間", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b577dac7.JPG", period: "通年" },
    { id: "tg_meguro_koban", name: "目黒小判", category: "年間", price: 200, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/405a0628.JPG", period: "通年" },
    { id: "tg_meguro_roman", name: "目黒浪漫", category: "年間", price: 200, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/c62e4db7.JPG", period: "通年" },
    { id: "tg_anzu_mochi", name: "あんず餅", category: "年間", price: 240, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b355826a.JPG", period: "通年" },
    { id: "tg_castella", name: "カステラ", category: "年間", price: 690, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/50ce3b62.JPG", period: "通年" },
    { id: "tg_jonamagashi", name: "上生菓子", category: "年間", price: 300, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/292b0467.JPG", period: "通年" },
    { id: "tg_sekihan_400", name: "お赤飯（400gパック）", category: "年間", price: 1080, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/45c2eba9.JPG", period: "通年" },
    { id: "tg_sekihan_270", name: "お赤飯（270gパック）", category: "年間", price: 730, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/45c2eba9.JPG", period: "通年" },
    { id: "tg_mamedaifuku", name: "豆大福", category: "年間", price: 190, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/003da94b.JPG", period: "通年" },
    { id: "tg_mitarashi_2", name: "みたらし団子（二本入り）", category: "年間", price: 260, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/4209b997.JPG", period: "通年" },
    { id: "tg_mitarashi_3", name: "みたらし団子（三本入り）", category: "年間", price: 380, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/4209b997.JPG", period: "通年" },
    { id: "tg_tamagawaya_manju", name: "玉川屋饅頭", category: "年間", price: 160, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/5c77fdbd.JPG", period: "通年" },
    { id: "tg_siberia", name: "シベリア", category: "年間", price: 200, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/3a36d181.JPG", period: "通年" },
    { id: "tg_fu_manju", name: "麩まんじゅう", category: "年間", price: 230, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/6a204a32.JPG", period: "通年" },
    { id: "tg_coffee_warabi_nenkan", name: "コーヒーわらび餅", category: "年間", price: 260, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/5125ae03.JPG", period: "通年" },

    // ──── 春の和菓子 ────
    { id: "tg_sakuramochi", name: "桜餅", category: "春", price: 240, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/647c0e6e.JPG", period: "1月下旬〜4月中旬" },
    { id: "tg_domyoji", name: "道明寺", category: "春", price: 240, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b265c646.jpg", period: "2月上旬〜4月中旬" },
    { id: "tg_kusamochi", name: "草餅", category: "春", price: 240, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/983aaef6.jpg", period: "2月上旬〜4月中旬" },
    { id: "tg_uguisu_mochi", name: "うぐいす餅", category: "春", price: 230, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/0f67696c.jpg", period: "1月下旬〜3月中旬" },

    // ──── 夏の和菓子 ────
    { id: "tg_kashiwamochi", name: "柏餅", category: "夏", price: 270, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/ba04df9d.JPG", period: "4月中旬〜5月中旬" },
    { id: "tg_mizuyokan", name: "水羊羹", category: "夏", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b8235332.JPG", period: "5月中旬〜9月中旬" },
    { id: "tg_mizumanju", name: "水まんじゅう", category: "夏", price: 220, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/f9318646.JPG", period: "5月下旬〜9月中旬" },
    { id: "tg_warabimochi", name: "わらび餅", category: "夏", price: 440, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/f04becb1.JPG", period: "5月下旬〜9月中旬" },
    { id: "tg_minazuki", name: "水無月", category: "夏", price: 230, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/3025b08b.JPG", period: "5月下旬〜7月上旬" },
    { id: "tg_wakaayu", name: "若鮎", category: "夏", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/a32a5e0d.JPG", period: "5月中旬〜9月上旬" },
    { id: "tg_coffee_warabi_natu", name: "コーヒーわらび餅", category: "夏", price: 260, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/82ac23ae.JPG" },
    { id: "tg_aoume", name: "青梅", category: "夏", price: 220, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/cb46ecd5.JPG" },
    { id: "tg_ryomi_mizuyokan", name: "涼味寄せ（水ようかん）", category: "夏", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/2125e974.JPG" },
    { id: "tg_ryomi_kurinouzan", name: "涼味寄せ（栗大納言寄せ）", category: "夏", price: 230, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/2125e974.JPG" },
    { id: "tg_ryomi_wafu_jelly", name: "涼味寄せ（和風ゼリー）", category: "夏", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/2125e974.JPG" },

    // ──── 秋の和菓子 ────
    { id: "tg_kurimushi_yokan_kiri", name: "栗蒸し羊羹（切身）", category: "秋", price: 300, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/78ca9821.JPG", period: "通年" },
    { id: "tg_kurimushi_yokan_sao", name: "栗蒸し羊羹（棹）", category: "秋", price: 1600, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/78ca9821.JPG", period: "通年" },
    { id: "tg_kurimushi_yokan_hansao", name: "栗蒸し羊羹（半棹）", category: "秋", price: 800, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/78ca9821.JPG", period: "通年" },
    { id: "tg_usagi_manju", name: "うさぎ饅頭", category: "秋", price: 190, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/79714713.JPG", period: "通年" },
    { id: "tg_meguro_mukashibanashi", name: "目黒昔話", category: "秋", price: 210, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/01944a7f.JPG", period: "通年" },
    { id: "tg_halloween_shigure", name: "ハロウィンしぐれ", category: "秋", price: 190, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/aa34293b.JPG", period: "通年" },
    { id: "tg_imoyokan", name: "芋ようかん", category: "秋", price: 140, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/d30f2baa.JPG", period: "通年" },
    { id: "tg_tsukimi_dango", name: "月見団子", category: "秋", price: 1650, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/63f456cf.JPG", period: "9月十五夜限定" },
    { id: "tg_kurikanoko", name: "栗かのこ", category: "秋", price: 380, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/91c0f576.JPG", period: "通年" },

    // ──── 冬の和菓子 ────
    { id: "tg_inoko_mochi", name: "亥の子餅", category: "冬", price: 190, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/bc6aff51.JPG" },
    { id: "tg_yuzu_manju", name: "柚子饅頭", category: "冬", price: 150, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/29584b41.jpg" },
    { id: "tg_hanabira_mochi", name: "花びら餅", category: "冬", price: 325, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/b2f749f7.jpg" },

    // ──── お彼岸・お盆の和菓子 ────
    { id: "tg_ohagi_koshi_tsubu", name: "おはぎ（こし・つぶ）", category: "お彼岸・お盆", price: 185, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/41fef9c4.JPG", period: "お彼岸のみ" },
    { id: "tg_ohagi_kinako_goma", name: "おはぎ（きな粉・ゴマ）", category: "お彼岸・お盆", price: 185, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/41fef9c4.JPG", period: "お彼岸のみ" },
    { id: "tg_omukae_dango", name: "お迎え団子", category: "お彼岸・お盆", price: 380, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/62ac73b6.jpg", period: "通年" },
    { id: "tg_itokiri_dango_l", name: "糸切り団子（大パック）", category: "お彼岸・お盆", price: 600, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/3cc24b28.JPG", period: "通年" },
    { id: "tg_itokiri_dango_s", name: "糸切り団子（小パック）", category: "お彼岸・お盆", price: 300, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/3cc24b28.JPG", period: "通年" },
    { id: "tg_rakugan", name: "らくがん", category: "お彼岸・お盆", price: 160, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/6bcc79b1.JPG", period: "通年" },
    { id: "tg_hasu_pack", name: "蓮の上（白おこわ）パック入り", category: "お彼岸・お盆", price: 760, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/0629a93b.JPG", period: "お盆限定" },

    // ──── 慶弔の和菓子 ────
    { id: "tg_tanjomochi", name: "誕生餅（一升餅）", category: "慶弔", price: 4500, image: "https://www.wagashi-tamagawaya.com/_p/4630/images/pc/1892407a.jpg", period: "翌日" },
  ],
};

export default tamagawaya;
