import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import { formatMoney } from "@/features/money/money";
import {
  ledgerPageHref,
  parseLedgerFilters,
  SearchParams,
} from "@/features/money/ledger-filters";
import authService from "@/services/auth-service";
import categoriesService from "@/services/categories.service";
import instrumentsService from "@/services/instruments.service";
import transactionsService from "@/services/transactions.service";
import { Route } from "next";
import Link from "next/link";
import LedgerFilters from "./components/LedgerFilters";

export default async function TransactionsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  await authService.requireAuthenticatedUser();
  const query = await searchParams;
  let current: ReturnType<typeof parseLedgerFilters>;
  try {
    current = parseLedgerFilters(query);
  } catch (cause) {
    return (
      <main className="admin-shell min-h-screen">
        <PageContainer className="mx-auto max-w-4xl">
          <TopNavigator links={["home", "money"]} />
          <h1 className="mt-8 text-3xl font-semibold">Check your filters</h1>
          <p role="alert" className="my-6">
            {cause instanceof Error ? cause.message : "Invalid filters."}
          </p>
          <Link
            className="admin-primary-button"
            href="/admin/money/transactions"
          >
            Clear filters
          </Link>
        </PageContainer>
      </main>
    );
  }
  const [categories, instruments] = await Promise.all([
    categoriesService.getAllCategories(),
    instrumentsService.getAll(),
  ]);
  const categoryIds = current.categoryId
    ? [
        current.categoryId,
        ...categories
          .filter((category) => category.parentId === current.categoryId)
          .map(({ id }) => id),
      ]
    : undefined;
  const ledger = await transactionsService.getLedger(
    { ...current.filters, categoryIds },
    current.page,
    current.sort,
  );
  const options = categories
    .map((category) => ({
      id: category.id,
      name: `${category.parentId ? `${categories.find(({ id }) => id === category.parentId)?.name} / ` : ""}${category.name}${category.isArchived ? " (archived)" : ""}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="admin-shell min-h-screen pb-10">
      <PageContainer className="mx-auto max-w-6xl">
        <TopNavigator links={["home", "money"]} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-eyebrow">SGD ledger</p>
            <h1 className="mt-2 text-3xl font-semibold">Transactions</h1>
            <p className="mt-2 text-sm text-admin-muted">
              Every money movement, in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="admin-secondary-button"
              href="/admin/money/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="admin-primary-button"
              href="/admin/money/transactions/new"
            >
              Add transaction
            </Link>
          </div>
        </div>
        <LedgerFilters
          key={JSON.stringify(current)}
          current={current}
          categories={options}
          instruments={instruments}
        />
        <p className="mt-6 text-sm text-admin-muted">
          Totals for all matching transactions
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="admin-stat-card">
            <span>Money in</span>
            <strong className="text-emerald-300">
              {formatMoney(ledger.incomeCents)}
            </strong>
          </div>
          <div className="admin-stat-card">
            <span>Money out</span>
            <strong className="text-rose-300">
              {formatMoney(ledger.expenseCents)}
            </strong>
          </div>
          <div className="admin-stat-card">
            <span>Net movement</span>
            <strong>
              {formatMoney(ledger.incomeCents - ledger.expenseCents)}
            </strong>
          </div>
        </div>
        <section
          aria-label="Transactions"
          className="admin-panel mt-6 overflow-hidden rounded-2xl"
        >
          <h2 className="border-b border-admin-line px-4 py-4 font-semibold">
            {ledger.count} matching transaction{ledger.count === 1 ? "" : "s"}
          </h2>
          <div className="divide-y divide-admin-line">
            {ledger.transactions.map((transaction) => (
              <Link
                key={transaction.id}
                href={`/admin/money/transactions/${transaction.id}`}
                className="grid min-w-0 gap-3 p-4 hover:bg-white/5 sm:grid-cols-[1fr_auto] sm:p-5"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold">
                    {transaction.title}
                  </h3>
                  <p className="mt-1 break-words text-sm text-admin-muted">
                    {transaction.category.parent
                      ? `${transaction.category.parent.name} / `
                      : ""}
                    {transaction.category.name} · {transaction.instrument.name}
                  </p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {transaction.time.toLocaleString("en-SG", {
                      timeZone: "Asia/Singapore",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    SGT
                  </p>
                  {(transaction.counterparty || transaction.reference) && (
                    <p className="mt-2 break-words text-xs text-admin-muted">
                      {[
                        transaction.counterparty,
                        transaction.reference &&
                          `Ref: ${transaction.reference}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {transaction.comments && (
                    <p className="mt-2 line-clamp-2 break-words text-sm text-admin-muted">
                      {transaction.comments}
                    </p>
                  )}
                </div>
                <p
                  className={`self-center font-semibold sm:text-right ${transaction.direction === "IN" ? "text-emerald-300" : "text-rose-300"}`}
                >
                  <span className="mr-2 text-xs">
                    {transaction.direction === "IN" ? "Money in" : "Money out"}
                  </span>
                  {transaction.direction === "IN" ? "+" : "−"}
                  {formatMoney(transaction.amountCents)}
                </p>
              </Link>
            ))}
          </div>
          {ledger.count === 0 && (
            <div className="p-8 text-center">
              <p>No transactions match these filters.</p>
              <p className="mt-2 text-sm text-admin-muted">
                Clear the filters or add your first transaction.
              </p>
            </div>
          )}
        </section>
        <nav
          aria-label="Transaction pages"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"
        >
          {ledger.page > 1 ? (
            <Link
              className="admin-secondary-button"
              href={ledgerPageHref(query, ledger.page - 1) as Route}
            >
              Previous
            </Link>
          ) : (
            <span className="text-admin-muted">Previous</span>
          )}
          <span>
            Page {ledger.page} of {ledger.totalPages}
          </span>
          {ledger.page < ledger.totalPages ? (
            <Link
              className="admin-secondary-button"
              href={ledgerPageHref(query, ledger.page + 1) as Route}
            >
              Next
            </Link>
          ) : (
            <span className="text-admin-muted">Next</span>
          )}
        </nav>
      </PageContainer>
    </main>
  );
}
