import type {
  Item,
  BudgetSearchConfig,
  BudgetSearchOutcome,
  BudgetSearchResult,
  BudgetSearchResultLine,
} from "./types";

// ============================================================
// 予算探索モード：純関数群
// ============================================================

const CAP = 400; // 結果件数の上限
const MAX_NODES = 200_000; // 探索ノード数の上限（重い探索の早期リターン用）

function gcdTwo(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function gcdAll(prices: number[]): number {
  if (prices.length === 0) return 1;
  return prices.reduce((g, p) => gcdTwo(g, p), prices[0]);
}

type PoolEntry = { price: number; ids: string[]; category: string };

// 同一カテゴリ・同一価格のアイテムを1グループにまとめる
export function groupByPrice(items: Item[]): PoolEntry[] {
  const map = new Map<string, PoolEntry>();
  for (const it of items) {
    const key = `${it.category}::${it.price}`;
    const existing = map.get(key);
    if (existing) {
      existing.ids.push(it.id);
    } else {
      map.set(key, { price: it.price, ids: [it.id], category: it.category });
    }
  }
  return [...map.values()];
}

function toPool(items: Item[], group: boolean): PoolEntry[] {
  if (group) return groupByPrice(items);
  return items.map((it) => ({ price: it.price, ids: [it.id], category: it.category }));
}

type Chosen = { entryIdx: number; qty: number };

function materialize(
  chosen: Chosen[],
  pool: PoolEntry[],
  requiredLines: BudgetSearchResultLine[],
  requiredCost: number
): BudgetSearchResult {
  const lines: BudgetSearchResultLine[] = [...requiredLines];
  let total = requiredCost;
  let count = requiredLines.reduce((s, l) => s + l.qty, 0);
  for (const c of chosen) {
    const entry = pool[c.entryIdx];
    lines.push({ itemId: entry.ids[0], groupIds: entry.ids, qty: c.qty });
    total += entry.price * c.qty;
    count += c.qty;
  }
  return { lines, total, count };
}

export function searchCombinations(
  items: Item[],
  config: BudgetSearchConfig
): BudgetSearchOutcome {
  const candidates = items.filter((it) => !config.excludedIds.includes(it.id));
  const required = candidates.filter((it) => config.requiredIds.includes(it.id));
  const requiredCost = required.reduce((s, it) => s + it.price, 0);
  const requiredLines: BudgetSearchResultLine[] = required.map((it) => ({
    itemId: it.id,
    groupIds: [it.id],
    qty: 1,
  }));
  const remaining = config.budget - requiredCost;

  const rest = candidates.filter((it) => !config.requiredIds.includes(it.id));
  const pool = toPool(rest, config.groupEquivalents).sort((a, b) => b.price - a.price);

  if (remaining < 0) {
    return { kind: "unreachable", nearestDown: null, nearestUp: null, gcd: gcdAll(pool.map((p) => p.price)) };
  }

  const gcd = gcdAll(pool.length > 0 ? pool.map((p) => p.price) : [remaining || 1]);

  if (config.mode === "exact" && remaining % gcd !== 0) {
    const downUnits = Math.floor(remaining / gcd);
    const upUnits = Math.ceil(remaining / gcd);
    return {
      kind: "unreachable",
      nearestDown: downUnits >= 0 ? downUnits * gcd + requiredCost : null,
      nearestUp: upUnits * gcd + requiredCost,
      gcd,
    };
  }

  const results: BudgetSearchResult[] = [];
  let best: BudgetSearchResult | null = null;
  let nodeCount = 0;
  let cappedByNodes = false;

  const isBetter = (candidate: BudgetSearchResult, current: BudgetSearchResult | null) => {
    if (!current) return true;
    if (config.mode === "maximize-count") {
      if (candidate.count !== current.count) return candidate.count > current.count;
      return candidate.total > current.total;
    }
    // maximize-price
    if (candidate.total !== current.total) return candidate.total > current.total;
    return candidate.count > current.count;
  };

  function recurse(
    startIdx: number,
    remain: number,
    chosen: Chosen[],
    depth: number,
    catCount: Record<string, number>
  ) {
    if (results.length >= CAP) return;
    if (nodeCount >= MAX_NODES) {
      cappedByNodes = true;
      return;
    }
    nodeCount++;

    if (config.mode === "exact") {
      if (remain === 0) {
        results.push(materialize(chosen, pool, requiredLines, requiredCost));
        return;
      }
    } else {
      // maximize-*: 「予算以内」なら常に候補として評価
      const candidate = materialize(chosen, pool, requiredLines, requiredCost);
      if (isBetter(candidate, best)) best = candidate;
    }

    if (depth >= config.maxItems) return;

    for (let idx = startIdx; idx < pool.length; idx++) {
      if (results.length >= CAP || nodeCount >= MAX_NODES) return;
      const entry = pool[idx];
      if (entry.price > remain) continue;

      const curCatQty = catCount[entry.category] ?? 0;
      const limit = config.categoryLimits[entry.category];
      if (limit !== undefined && curCatQty >= limit) continue;

      const last = chosen[chosen.length - 1];
      if (last && last.entryIdx === idx) {
        last.qty += 1;
      } else {
        chosen.push({ entryIdx: idx, qty: 1 });
      }
      catCount[entry.category] = curCatQty + 1;

      recurse(idx, remain - entry.price, chosen, depth + 1, catCount);

      catCount[entry.category] = curCatQty;
      const tail = chosen[chosen.length - 1];
      if (tail.qty > 1) {
        tail.qty -= 1;
      } else {
        chosen.pop();
      }
    }
  }

  const initialCatCount: Record<string, number> = {};
  for (const it of required) {
    initialCatCount[it.category] = (initialCatCount[it.category] ?? 0) + 1;
  }
  recurse(0, remaining, [], 0, initialCatCount);

  if (config.mode !== "exact") {
    // required のみで既に条件を満たす場合（poolから何も選ばない）もbest候補になる
    const zeroChoice = materialize([], pool, requiredLines, requiredCost);
    if (isBetter(zeroChoice, best)) best = zeroChoice;
    return {
      kind: "ok",
      results: best ? [best] : [],
      truncated: false,
      totalFound: best ? 1 : 0,
    };
  }

  results.sort((a, b) => (a.count !== b.count ? a.count - b.count : a.total - b.total));

  return {
    kind: "ok",
    results: results.slice(0, CAP),
    truncated: cappedByNodes || results.length > CAP,
    totalFound: results.length,
  };
}
