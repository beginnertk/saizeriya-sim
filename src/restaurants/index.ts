// 新しいレストランを追加するときは：
// 1. このフォルダに xxx.ts を作成
// 2. ここでimportしてrestaurants配列に追加するだけ

import saizeriya from "./saizeriya";
import hidakaya from "./hidakaya";
import type { Restaurant } from "../types";

export const restaurants: Restaurant[] = [saizeriya, hidakaya];

export { saizeriya, hidakaya };




