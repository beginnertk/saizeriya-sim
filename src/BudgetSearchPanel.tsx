import type {
  Item,
  Restaurant,
  BudgetSearchConfig,
  BudgetSearchOutcome,
  BudgetSearchResult,
} from "./types";

// ============================================================
// 予算探索パネル
// ============================================================

export default function BudgetSearchPanel({
  items,
  restaurant,
  config,
  setConfig,
  outcome,
  onSearch,
  onApply,
  yen,
}: {
  items: Item[];
  restaurant: Restaurant;
  config: BudgetSearchConfig;
  setConfig: (v: BudgetSearchConfig | ((p: BudgetSearchConfig) => BudgetSearchConfig)) => void;
  outcome: BudgetSearchOutcome | null;
  onSearch: () => void;
  onApply: (result: BudgetSearchResult) => void;
  yen: (n: number) => string;
}) {
  const toggleInSet = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const findItem = (id: string) => items.find((it) => it.id === id);

  return (
    <div className="mt-4 space-y-4">
      {/* 条件設定 */}
      <div className="rounded-2xl border border-neutral-800 p-4">
        <h2 className="mb-3 text-lg font-semibold">予算探索の条件</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 予算・品数上限・モード */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="shrink-0 text-neutral-400 w-20">予算</span>
              <input
                type="text"
                inputMode="numeric"
                className="w-full rounded-lg bg-neutral-900 px-3 py-1.5 text-right tabular-nums"
                value={config.budget.toLocaleString("ja-JP")}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  const n = Number(raw);
                  if (raw === "" || (Number.isFinite(n) && n >= 0)) {
                    setConfig((prev) => ({ ...prev, budget: raw === "" ? 0 : n }));
                  }
                }}
              />
              <span className="shrink-0 text-neutral-400">円</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="shrink-0 text-neutral-400 w-20">品数上限</span>
              <input
                type="number"
                min={1}
                max={8}
                className="w-full rounded-lg bg-neutral-900 px-3 py-1.5 text-right tabular-nums"
                value={config.maxItems}
                onChange={(e) => {
                  const n = Math.max(1, Math.min(8, Number(e.target.value) || 1));
                  setConfig((prev) => ({ ...prev, maxItems: n }));
                }}
              />
              <span className="shrink-0 text-neutral-400">品</span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {(
                [
                  ["exact", "ちょうど探索"],
                  ["maximize-price", "予算以内で最高額"],
                  ["maximize-count", "予算以内で最多品数"],
                ] as const
              ).map(([mode, label]) => (
                <label key={mode} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="budget-search-mode"
                    checked={config.mode === mode}
                    onChange={() => setConfig((prev) => ({ ...prev, mode }))}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={config.groupEquivalents}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, groupEquivalents: e.target.checked }))
                }
              />
              <span>同価格の互換品をグループ化する</span>
            </label>
          </div>

          {/* カテゴリ上限 */}
          <div>
            <div className="text-sm text-neutral-400 mb-1.5">カテゴリ上限（空欄=無制限）</div>
            <div className="space-y-1.5">
              {restaurant.categories.map((cat) => (
                <div key={cat} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 truncate">{cat}</span>
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded-lg bg-neutral-900 px-2 py-1 text-right text-xs tabular-nums"
                    value={config.categoryLimits[cat] ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setConfig((prev) => {
                        const next = { ...prev.categoryLimits };
                        if (raw === "") {
                          delete next[cat];
                        } else {
                          next[cat] = Math.max(0, Number(raw) || 0);
                        }
                        return { ...prev, categoryLimits: next };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 必須品・除外品（カテゴリごとに折りたたみ） */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ItemPicker
            title="必ず含める品"
            restaurant={restaurant}
            items={items}
            selectedIds={config.requiredIds}
            yen={yen}
            onToggle={(id) =>
              setConfig((prev) => ({ ...prev, requiredIds: toggleInSet(prev.requiredIds, id) }))
            }
          />
          <ItemPicker
            title="除外する品"
            restaurant={restaurant}
            items={items}
            selectedIds={config.excludedIds}
            yen={yen}
            onToggle={(id) =>
              setConfig((prev) => ({ ...prev, excludedIds: toggleInSet(prev.excludedIds, id) }))
            }
          />
        </div>

        <button
          className="mt-4 w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition"
          onClick={onSearch}
        >
          探索実行
        </button>
      </div>

      {/* 結果表示 */}
      {outcome && outcome.kind === "unreachable" && (
        <div className="rounded-2xl border border-red-800 bg-red-950/30 p-4">
          <div className="text-sm text-red-300">
            ✗ 達成不可能（この店の価格は {outcome.gcd} 円単位でのみ組み合わせ可能）
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {outcome.nearestDown !== null && (
              <button
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700 transition tabular-nums"
                onClick={() => setConfig((prev) => ({ ...prev, budget: outcome.nearestDown! }))}
              >
                {yen(outcome.nearestDown)} で再探索
              </button>
            )}
            {outcome.nearestUp !== null && (
              <button
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700 transition tabular-nums"
                onClick={() => setConfig((prev) => ({ ...prev, budget: outcome.nearestUp! }))}
              >
                {yen(outcome.nearestUp)} で再探索
              </button>
            )}
          </div>
        </div>
      )}

      {outcome && outcome.kind === "ok" && (
        <div className="rounded-2xl border border-neutral-800 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              結果（{outcome.results.length}件{outcome.truncated ? "・先頭のみ表示" : ""}）
            </h2>
          </div>
          {outcome.results.length === 0 ? (
            <div className="text-center text-neutral-500 py-8">
              条件に合う組み合わせが見つかりませんでした
            </div>
          ) : (
            <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
              {outcome.results.map((result, i) => (
                <div key={i} className="rounded-xl border border-neutral-800 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      {result.lines.map((line, li) => {
                        const rep = findItem(line.itemId);
                        const alt = line.groupIds
                          .map((id) => findItem(id)?.name)
                          .filter(Boolean);
                        return (
                          <div key={li} className="text-sm text-neutral-200 truncate">
                            {rep?.name ?? line.itemId} × {line.qty}
                            {alt.length > 1 && (
                              <span className="text-xs text-neutral-500">
                                {" "}（{alt.join("／")} から）
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold tabular-nums">{yen(result.total)}</div>
                      <div className="text-xs text-neutral-500 tabular-nums">{result.count} 品</div>
                    </div>
                  </div>
                  <button
                    className="mt-2 w-full rounded-lg bg-[var(--accent-15)] border border-[var(--accent-50)] px-3 py-1.5 text-xs font-medium text-[var(--accent-light)] hover:bg-[var(--accent-20)] transition"
                    onClick={() => onApply(result)}
                  >
                    この組み合わせを選択
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 必須品／除外品ピッカー（カテゴリごとに折りたたみ）
// ============================================================

function ItemPicker({
  title,
  restaurant,
  items,
  selectedIds,
  yen,
  onToggle,
}: {
  title: string;
  restaurant: Restaurant;
  items: Item[];
  selectedIds: string[];
  yen: (n: number) => string;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="text-sm text-neutral-400 mb-1.5">
        {title}
        {selectedIds.length > 0 && (
          <span className="ml-1.5 text-xs text-[var(--accent-light)]">（{selectedIds.length}件選択中）</span>
        )}
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-neutral-800 p-2">
        {restaurant.categories.map((cat) => {
          const group = items.filter((it) => it.category === cat);
          if (group.length === 0) return null;
          const selectedInCat = group.filter((it) => selectedIds.includes(it.id)).length;
          return (
            <details key={cat} open={selectedInCat > 0}>
              <summary className="cursor-pointer text-xs text-neutral-300 py-0.5 select-none">
                {cat}
                {selectedInCat > 0 && (
                  <span className="ml-1 text-[var(--accent-light)]">（{selectedInCat}）</span>
                )}
              </summary>
              <div className="pl-3 space-y-1 py-1">
                {group.map((it) => (
                  <label key={it.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(it.id)}
                      onChange={() => onToggle(it.id)}
                    />
                    <span className="truncate">
                      {it.name}（{yen(it.price)}）
                    </span>
                  </label>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
