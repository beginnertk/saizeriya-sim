import React, { useState, useEffect } from "react";
import { restaurants } from "./restaurants";
import type { Restaurant } from "./types";
import Simulator from "./Simulator";

/** URLハッシュから共有パラメータを読み取る */
function parseShareHash(): { restaurantId: string; qty: Record<string, number>; cloudId?: string } | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const rId = params.get("r");
  if (!rId) return null;
  const qStr = params.get("q");
  const qty: Record<string, number> = {};
  if (qStr) {
    for (const pair of qStr.split(",")) {
      const [id, count] = pair.split(":");
      if (id && count) qty[id] = Math.max(0, parseInt(count, 10) || 0);
    }
  }
  const cloudId = params.get("cloud") ?? undefined;
  return { restaurantId: rId, qty, cloudId };
}

export default function App() {
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [sharedQty, setSharedQty] = useState<Record<string, number> | null>(null);
  const [sharedCloudId, setSharedCloudId] = useState<string | null>(null);

  // 起動時にURLハッシュを読み取り、該当レストランを自動選択
  useEffect(() => {
    const shared = parseShareHash();
    if (!shared) return;
    const restaurant = restaurants.find((r) => r.id === shared.restaurantId);
    if (restaurant) {
      setSelected(restaurant);
      setSharedQty(shared.qty);
      if (shared.cloudId) setSharedCloudId(shared.cloudId);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // 店舗が選ばれたらシミュレーター画面へ
  if (selected) {
    return (
      <Simulator
        restaurant={selected}
        onBack={() => { setSelected(null); setSharedQty(null); setSharedCloudId(null); }}
        initialQty={sharedQty}
        initialCloudId={sharedCloudId}
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
