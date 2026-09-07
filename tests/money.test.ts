import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_MONEY_CENTS,
  parseMoneyToCents,
  applyTransaction,
} from "../src/features/money/money";
import {
  parseMoneyDateTime,
  formatMoneyDateTimeInput,
  parseMoneyDateStart,
  parseMoneyDateEnd,
  getBudgetForDateRange,
} from "../src/features/money/date-ranges";
import {
  ledgerPageHref,
  parseLedgerFilters,
} from "../src/features/money/ledger-filters";
import { validateCategoryAssignment } from "../src/features/money/category-policy";

const category = {
  id: "1234567890abcdef12345678",
  usage: "BOTH" as const,
  isArchived: false,
  childCount: 0,
};

test("amounts preserve cents, including small values and the database limit", () => {
  assert.equal(parseMoneyToCents("0.29"), 29);
  assert.equal(parseMoneyToCents("21474836.47"), MAX_MONEY_CENTS);
  assert.equal(parseMoneyToCents("-12.30", true), -1230);
});
test("amounts reject overflow, malformed separators, exponents and excess decimals", () => {
  for (const amount of [
    "21474836.48",
    "1,2",
    "1e3",
    "NaN",
    "Infinity",
    "0.001",
    "-1",
    "",
  ])
    assert.throws(() => parseMoneyToCents(amount));
});
test("income and expenses adjust the balance with opposite signs", () => {
  assert.equal(applyTransaction(1000, 230, "IN"), 1230);
  assert.equal(applyTransaction(1000, 1230, "OUT"), -230);
});
test("Singapore date-time input round-trips independently of the server timezone", () => {
  const date = parseMoneyDateTime("2026-09-07T00:05");
  assert.equal(date.toISOString(), "2026-09-06T16:05:00.000Z");
  assert.equal(formatMoneyDateTimeInput(date), "2026-09-07T00:05");
});
test("invalid calendar dates and rollover hours cannot silently become another date", () => {
  for (const date of [
    "2026-02-29T12:00",
    "2026-09-07T24:00",
    "2026-09-07T12:60",
    "invalid",
  ])
    assert.throws(() => parseMoneyDateTime(date));
  assert.equal(
    formatMoneyDateTimeInput(parseMoneyDateTime("2028-02-29T23:59")),
    "2028-02-29T23:59",
  );
});
test("date filters include both boundaries of a Singapore day", () => {
  assert.equal(
    parseMoneyDateStart("2026-09-07")?.toISOString(),
    "2026-09-06T16:00:00.000Z",
  );
  assert.equal(
    parseMoneyDateEnd("2026-09-07")?.toISOString(),
    "2026-09-07T15:59:59.999Z",
  );
});
test("the default ledger includes all dates and both directions", () => {
  const result = parseLedgerFilters({});
  assert.equal(result.direction, undefined);
  assert.equal(result.filters.from, undefined);
  assert.equal(result.filters.to, undefined);
  assert.equal(result.sort, "newest");
  assert.equal(result.page, 1);
});
test("combined filters retain search, direction, instrument and inclusive amount bounds", () => {
  const result = parseLedgerFilters({
    direction: "IN",
    instrument: category.id,
    search: "  Salary ",
    min: "0",
    max: "25.50",
    from: "2026-09-01",
    sort: "highest",
    page: "3",
  });
  assert.equal(result.filters.direction, "IN");
  assert.equal(result.filters.search, "Salary");
  assert.equal(result.filters.instrumentId, category.id);
  assert.equal(result.filters.minAmountCents, 0);
  assert.equal(result.filters.maxAmountCents, 2550);
  assert.equal(result.filters.to, undefined);
  assert.equal(result.page, 3);
});
test("invalid dates, IDs, reversed ranges and reversed amounts produce errors", () => {
  for (const query of [
    { category: "bad" },
    { instrument: "bad" },
    { from: "2026-02-30" },
    { from: "2026-09-10", to: "2026-09-01" },
    { min: "10", max: "1" },
  ])
    assert.throws(() => parseLedgerFilters(query));
});
test("untrusted page and sort values fall back to usable defaults", () => {
  for (const page of ["-1", "Infinity", "1.5", "garbage", "9007199254740992"])
    assert.equal(parseLedgerFilters({ page }).page, 1);
  assert.equal(parseLedgerFilters({ sort: "invalid" }).sort, "newest");
});
test("pagination preserves active filters and replaces the page", () => {
  const url = new URL(
    ledgerPageHref(
      {
        search: "rice & fish",
        category: category.id,
        direction: "OUT",
        min: "2.50",
        page: "1",
      },
      2,
    ),
    "https://example.test",
  );
  assert.equal(url.searchParams.get("search"), "rice & fish");
  assert.equal(url.searchParams.get("direction"), "OUT");
  assert.deepEqual(url.searchParams.getAll("page"), ["2"]);
});
test("flat categories accept both directions without requiring a subcategory", () => {
  assert.doesNotThrow(() => validateCategoryAssignment(category, "IN"));
  assert.doesNotThrow(() => validateCategoryAssignment(category, "OUT"));
});
test("category direction is enforced for assignment", () => {
  assert.throws(() =>
    validateCategoryAssignment({ ...category, usage: "IN" }, "OUT"),
  );
  assert.doesNotThrow(() =>
    validateCategoryAssignment({ ...category, usage: "IN" }, "IN"),
  );
});
test("archived categories can be retained on historical entries but not newly assigned", () => {
  const archived = { ...category, isArchived: true };
  assert.throws(() => validateCategoryAssignment(archived, "OUT"));
  assert.throws(() =>
    validateCategoryAssignment(archived, "OUT", "another-id"),
  );
  assert.doesNotThrow(() =>
    validateCategoryAssignment(archived, "OUT", category.id),
  );
});
test("parent categories cannot receive transactions directly", () => {
  assert.throws(() =>
    validateCategoryAssignment({ ...category, childCount: 1 }, "IN"),
  );
});
test("monthly budgets prorate across different month lengths and leap years", () => {
  assert.equal(getBudgetForDateRange(3100, "2026-01-01", "2026-01-10"), 1000);
  assert.equal(getBudgetForDateRange(2900, "2028-02-01", "2028-02-29"), 2900);
  assert.equal(getBudgetForDateRange(3100, "2026-01-01", "2026-02-28"), 6200);
});
