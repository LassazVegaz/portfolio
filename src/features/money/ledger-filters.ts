import {
  getPresetDateRange,
  isMoneyDatePreset,
  isValidMoneyDateInput,
  parseMoneyDateEnd,
  parseMoneyDateStart,
} from "./date-ranges";
import { MoneyDirection, parseMoneyToCents } from "./money";

export type SearchParams = Record<string, string | string[] | undefined>;
export type LedgerSort = "newest" | "oldest" | "highest" | "lowest";
export const LEDGER_PAGE_SIZE = 25;
export const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);
const first = (value: SearchParams[string]) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export function parseLedgerFilters(query: SearchParams) {
  const search = first(query.search).trim().slice(0, 120);
  const directionValue = first(query.direction);
  const direction: MoneyDirection | undefined =
    directionValue === "IN" || directionValue === "OUT"
      ? directionValue
      : undefined;
  const categoryId = first(query.category);
  const instrumentId = first(query.instrument);
  if (categoryId && !isObjectId(categoryId))
    throw new Error("Choose a valid category.");
  if (instrumentId && !isObjectId(instrumentId))
    throw new Error("Choose a valid instrument.");
  const preset = first(query.range);
  const range = isMoneyDatePreset(preset)
    ? getPresetDateRange(preset)
    : undefined;
  const from = range?.from ?? first(query.from);
  const to = range?.to ?? first(query.to);
  if (
    (from && !isValidMoneyDateInput(from)) ||
    (to && !isValidMoneyDateInput(to))
  ) {
    throw new Error("Choose valid dates.");
  }
  if (from && to && from > to)
    throw new Error("The start date must be before the end date.");
  const min = first(query.min);
  const max = first(query.max);
  const minAmountCents = min ? parseMoneyToCents(min) : undefined;
  const maxAmountCents = max ? parseMoneyToCents(max) : undefined;
  if (
    minAmountCents !== undefined &&
    maxAmountCents !== undefined &&
    minAmountCents > maxAmountCents
  ) {
    throw new Error("Minimum amount cannot exceed maximum amount.");
  }
  const sortValue = first(query.sort);
  const sort: LedgerSort =
    sortValue === "oldest" || sortValue === "highest" || sortValue === "lowest"
      ? sortValue
      : "newest";
  const pageValue = Number(first(query.page));
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  return {
    search,
    direction,
    categoryId,
    instrumentId,
    from,
    to,
    min,
    max,
    sort,
    page,
    filters: {
      search,
      direction,
      instrumentId: instrumentId || undefined,
      from: parseMoneyDateStart(from),
      to: parseMoneyDateEnd(to),
      minAmountCents,
      maxAmountCents,
    },
  };
}

export function ledgerPageHref(query: SearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === "page" || !value) continue;
    for (const item of Array.isArray(value) ? value : [value])
      params.append(key, item);
  }
  params.set("page", String(page));
  return `/admin/money/transactions?${params}`;
}
