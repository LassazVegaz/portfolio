import FloatingAction from "@/components/FloatingAction";
import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import {
  formatMoneyDateInput,
  getPresetDateRange,
  isExactMonthRange,
  isMoneyDatePreset,
  isSingleDayRange,
  isValidMoneyDateInput,
  MoneyDateRangePreset,
  parseMoneyDateEnd,
  parseMoneyDateStart,
} from "@/features/money/date-ranges";
import {
  buildCategorySummaries,
  buildLineChart,
  getCategoryGroups,
} from "@/features/money/dashboard";
import { formatMoney, MoneyDirection } from "@/features/money/money";
import authService from "@/services/auth-service";
import categoriesService from "@/services/categories.service";
import savedMoneyFiltersService from "@/services/saved-money-filters.service";
import transactionsService, {
  TransactionFilters,
} from "@/services/transactions.service";
import { Route } from "next";
import Link from "next/link";
import DashboardFilters from "./components/DashboardFilters";
import { MobileTransaction, TransactionRow } from "./components/Mobile";
import Stat from "./components/Stat";
import MoneyCharts from "./MoneyCharts";

const PAGE_SIZE = 12;
type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const many = (value: string | string[] | undefined) =>
  value ? (Array.isArray(value) ? value : [value]) : [];

export default async function TransactionsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParams>;
}>) {
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(first(query.page) ?? "1", 10) || 1);
  const requestedPreset = first(query.range);
  const rangePreset: MoneyDateRangePreset | null = isMoneyDatePreset(requestedPreset)
    ? requestedPreset
    : first(query.from) || first(query.to)
      ? null
      : "THIS_MONTH";
  const presetRange = rangePreset ? getPresetDateRange(rangePreset) : null;
  const fallbackRange = getPresetDateRange("THIS_MONTH");
  const requestedFrom = presetRange?.from ?? first(query.from);
  const requestedTo = presetRange?.to ?? first(query.to);
  const hasValidCustomRange =
    !!requestedFrom &&
    !!requestedTo &&
    isValidMoneyDateInput(requestedFrom) &&
    isValidMoneyDateInput(requestedTo) &&
    requestedFrom <= requestedTo;
  const from = hasValidCustomRange ? requestedFrom : fallbackRange.from;
  const to = hasValidCustomRange ? requestedTo : fallbackRange.to;
  const direction: MoneyDirection = first(query.direction) === "IN" ? "IN" : "OUT";
  const showSubcategories = first(query.subcategories) !== "hide";
  const requestedCashflow = first(query.cashflow);
  const showCashflow =
    requestedCashflow === "true"
      ? true
      : requestedCashflow === "false"
        ? false
        : isExactMonthRange(from, to);

  const [allCategories, balanceCents, user] = await Promise.all([
    categoriesService.getAllCategories(),
    transactionsService.getBalanceCents(),
    authService.requireAuthenticatedUser(),
  ]);
  const categoryIds = many(query.category)
    .filter((id) => allCategories.some((category) => category.id === id))
    .slice(0, 10);
  const sortedCategories = [...allCategories].sort((left, right) => {
    const leftParent = allCategories.find(({ id }) => id === left.parentId)?.name ?? left.name;
    const rightParent = allCategories.find(({ id }) => id === right.parentId)?.name ?? right.name;
    return leftParent.localeCompare(rightParent) || left.name.localeCompare(right.name);
  });
  const groupResult = getCategoryGroups(
    sortedCategories,
    categoryIds,
    showSubcategories,
  );
  const filters: TransactionFilters = {
    categoryIds: groupResult.filteredCategoryIds,
    from: parseMoneyDateStart(from),
    to: parseMoneyDateEnd(to),
  };
  const [cashflowTransactions, savedFilters] = await Promise.all([
    transactionsService.getAll(filters),
    savedMoneyFiltersService.getAll(user.id),
  ]);
  const transactions = cashflowTransactions.filter(
    (transaction) => transaction.direction === direction,
  );

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const descendingPage = transactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const ascendingPage = [...transactions]
    .reverse()
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const incomeCents = cashflowTransactions
    .filter((transaction) => transaction.direction === "IN")
    .reduce((sum, transaction) => sum + transaction.amountCents, 0);
  const expenseCents = cashflowTransactions
    .filter((transaction) => transaction.direction === "OUT")
    .reduce((sum, transaction) => sum + transaction.amountCents, 0);
  const directionTotalCents = direction === "IN" ? incomeCents : expenseCents;
  const savingsCents = incomeCents - expenseCents;
  const categorySummaries = groupResult.hasCategorySelection
    ? buildCategorySummaries(transactions, groupResult.groups, from, to)
    : [];
  const lineChart = buildLineChart(
    transactions,
    groupResult.groups,
    from,
    to,
    false,
  );

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === "page") continue;
      if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
      else if (value) params.set(key, value);
    }
    params.set("page", String(targetPage));
    return `/admin/money/transactions?${params}` as Route;
  };

  return (
    <main className="admin-shell min-h-screen pb-16">
      <PageContainer className="mx-auto max-w-7xl">
        <TopNavigator links={["home", "money"]} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-eyebrow">SGD ledger</p>
            <h1 className="mt-2 text-3xl font-semibold">Transactions</h1>
          </div>
          <Link href="/admin/money/settings" className="admin-secondary-button hidden md:inline-flex">
            Money settings
          </Link>
        </div>

        <div className="mt-page hidden md:block">
          <DashboardFilters
            key={`${direction}:${categoryIds.join(",")}:${showSubcategories}:${rangePreset}:${from}:${to}:${showCashflow}`}
            categories={sortedCategories.map(({ id, name, parentId, isSystem }) => ({
              id,
              name,
              parentId,
              isSystem,
            }))}
            savedFilters={savedFilters.map((filter) => ({
              id: filter.id,
              name: filter.name,
              direction: filter.direction,
              categoryIds: filter.categoryIds,
              showSubcategories: filter.showSubcategories,
              rangePreset: filter.rangePreset,
              from: filter.from ? formatMoneyDateInput(filter.from) : null,
              to: filter.to ? formatMoneyDateInput(filter.to) : null,
              showCashflow: filter.showCashflow,
            }))}
            current={{
              direction,
              categoryIds,
              showSubcategories,
              rangePreset,
              from,
              to,
              showCashflow,
            }}
          />
        </div>

        <details open className="admin-panel mt-page hidden rounded-admin md:block">
          <summary className="cursor-pointer px-page py-4 font-semibold">Numbers</summary>
          <div className="grid gap-4 border-t border-admin-line p-page md:grid-cols-2 xl:grid-cols-4">
            <Stat label="Current balance" value={formatMoney(balanceCents)} />
            <Stat
              label={showCashflow ? "Savings" : direction === "IN" ? "Total money in" : "Total money out"}
              value={formatMoney(showCashflow ? savingsCents : directionTotalCents)}
              tone={showCashflow && savingsCents < 0 ? "negative" : direction === "IN" || savingsCents >= 0 ? "positive" : undefined}
            />
            {showCashflow && (
              <>
                <Stat label="Money in" value={formatMoney(incomeCents)} tone="positive" />
                <Stat label="Money out" value={formatMoney(expenseCents)} tone="negative" />
                <Stat
                  label="Savings rate"
                  value={incomeCents ? `${((savingsCents / incomeCents) * 100).toFixed(1)}%` : "—"}
                  tone={savingsCents < 0 ? "negative" : "positive"}
                />
                <Stat
                  label="Money out / money in"
                  value={incomeCents ? `${((expenseCents / incomeCents) * 100).toFixed(1)}%` : "—"}
                />
              </>
            )}
            {categorySummaries.map((summary) => {
              const totalCents = transactions
                .filter(
                  (transaction) =>
                    transaction.direction === direction &&
                    summary.categoryIds.includes(transaction.categoryId),
                )
                .reduce((sum, transaction) => sum + transaction.amountCents, 0);
              return (
                <div key={summary.id} className="admin-stat-card">
                  <span>{summary.name}</span>
                  <strong>{formatMoney(totalCents)}</strong>
                  {direction === "OUT" && (
                    <small className={summary.remainingCents < 0 ? "text-rose-300" : "text-admin-muted"}>
                      {summary.budgetCents > 0
                        ? `${summary.remainingCents < 0 ? "Over" : "Remaining"} ${formatMoney(Math.abs(summary.remainingCents))} (${Math.abs(summary.remainingPercentage ?? 0).toFixed(1)}%)`
                        : "No monthly budget"}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </details>

        <div className="mt-page hidden md:block">
          <MoneyCharts
            lineData={lineChart.data}
            lineSeries={lineChart.series}
            barData={
              direction === "OUT"
                ? categorySummaries.map(({ name, actualCents, budgetCents }) => ({
                    category: name,
                    actualCents,
                    budgetCents,
                  }))
                : []
            }
            showLine={!isSingleDayRange(from, to)}
          />
        </div>

        <details open className="admin-panel mt-page overflow-hidden rounded-admin">
          <summary className="hidden cursor-pointer px-page py-4 font-semibold md:block">
            Transactions ({transactions.length})
          </summary>
          <div className="hidden grid-cols-[1.4fr_.6fr_.9fr_.8fr_.6fr_.8fr] gap-4 border-y border-admin-line px-5 py-3 text-xs uppercase tracking-wider text-admin-muted md:grid">
            <span>Transaction</span>
            <span>Direction</span>
            <span>Category</span>
            <span>Date</span>
            <span>Budget</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="hidden md:block">
            {descendingPage.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
          <div className="divide-y divide-admin-line md:hidden">
            {ascendingPage.map((transaction) => (
              <MobileTransaction key={transaction.id} transaction={transaction} />
            ))}
          </div>
          {transactions.length === 0 && (
            <p className="p-8 text-center text-sm text-admin-muted">
              No transactions match these filters.
            </p>
          )}
        </details>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link
            className={`admin-secondary-button ${safePage === 1 ? "pointer-events-none opacity-40" : ""}`}
            href={pageHref(Math.max(1, safePage - 1))}
          >
            Previous
          </Link>
          <span className="text-admin-muted">Page {safePage} of {totalPages}</span>
          <Link
            className={`admin-secondary-button ${safePage === totalPages ? "pointer-events-none opacity-40" : ""}`}
            href={pageHref(Math.min(totalPages, safePage + 1))}
          >
            Next
          </Link>
        </div>

        <FloatingAction href={"/admin/money/transactions/new" as Route}>+</FloatingAction>
      </PageContainer>
    </main>
  );
}
