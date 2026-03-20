import React, { useState } from "react";
import { restaurants } from "./restaurants";
import type { Restaurant } from "./types";
import Simulator from "./Simulator";

export default function App() {
  const [selected, setSelected] = useState<Restaurant | null>(null);

  // 店舗が選ばれたらシミュレーター画面へ
  if (selected) {
    return (
      <Simulator
        restaurant={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  // 店舗選択画面
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">外食シミュレーター</h1>
          <p className="text-neutral-400">
            お店を選んで、注文の組み合わせを事前に試せます
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <button
              key={r.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left hover:border-neutral-600 hover:bg-neutral-800 transition group"
              onClick={() => setSelected(r)}
            >
              <div className="text-2xl font-bold group-hover:text-emerald-400 transition">
                {r.name}
              </div>
              <div className="mt-2 text-sm text-neutral-400">
                {r.items.length} 品目
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {r.categories.join(" · ")}
              </div>
            </button>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-neutral-600">
          ※ 価格は変動する場合があります。最新情報は各店舗公式サイトをご確認ください。
        </p>
      </div>
    </div>
  );
}
