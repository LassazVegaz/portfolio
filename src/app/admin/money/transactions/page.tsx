import cn from "classnames";
import FloatingAction from "@/components/FloatingAction";
import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import { formatMoney } from "@/features/money/money";
import categoriesService from "@/services/categories.service";
import transactionsService, {
  TransactionFilters,
} from "@/services/transactions.service";
import Link from "next/link";
import { Route } from "next";
import MoneyCharts from "./MoneyCharts";

const PAGE_SIZE = 12;
type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const dateAt = (value: string | undefined, endOfDay = false) => {
  if (!value) return undefined;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function TransactionsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParams>;
}>) {
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(first(query.page) ?? "1", 10) || 1);
  const direction = first(query.direction);
  const filters: TransactionFilters = {
    categoryId: first(query.category),
    direction:
      direction === "IN" || direction === "OUT" ? direction : undefined,
    from: dateAt(first(query.from)),
    to: dateAt(first(query.to), true),
    search: first(query.search),
  };

  const [transactions, categories, balanceCents] = await Promise.all([
    transactionsService.getAll(filters),
    categoriesService.getAllCategories(),
    transactionsService.getBalanceCents(),
  ]);
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const descendingPage = transactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const ascendingPage = [...transactions]
    .reverse()
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const incomeCents = transactions
    .filter((transaction) => transaction.direction === "IN")
    .reduce((sum, transaction) => sum + transaction.amountCents, 0);
  const expenseCents = transactions
    .filter((transaction) => transaction.direction === "OUT")
    .reduce((sum, transaction) => sum + transaction.amountCents, 0);

  const monthlyMap = new Map<string, { income: number; expense: number }>();
  const categoryMap = new Map<string, number>();
  for (const transaction of transactions) {
    const month = transaction.time.toLocaleDateString("en-SG", {
      month: "short",
      year: "2-digit",
    });
    const monthly = monthlyMap.get(month) ?? { income: 0, expense: 0 };
    monthly[transaction.direction === "IN" ? "income" : "expense"] +=
      transaction.amountCents / 100;
    monthlyMap.set(month, monthly);
    if (transaction.direction === "OUT") {
      categoryMap.set(
        transaction.category.name,
        (categoryMap.get(transaction.category.name) ?? 0) +
          transaction.amountCents / 100,
      );
    }
  }
  const monthly = [...monthlyMap.entries()]
    .reverse()
    .slice(-12)
    .map(([month, values]) => ({ month, ...values }));
  const categoryChart = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, expense]) => ({ category, expense }));

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key !== "page" && typeof value === "string" && value)
        params.set(key, value);
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
          <Link
            href="/admin/money/settings"
            className="admin-secondary-button hidden md:inline-flex"
          >
            Opening balance
          </Link>
        </div>

        <section className="mt-7 hidden gap-4 md:grid md:grid-cols-4">
          <Stat label="Current balance" value={formatMoney(balanceCents)} />
          <Stat
            label="Filtered income"
            value={formatMoney(incomeCents)}
            tone="positive"
          />
          <Stat
            label="Filtered spending"
            value={formatMoney(expenseCents)}
            tone="negative"
          />
          <Stat
            label="Filtered net"
            value={formatMoney(incomeCents - expenseCents)}
          />
        </section>

        <form className="admin-panel mt-5 hidden gap-4 rounded-2xl p-5 md:grid lg:grid-cols-6">
          <input
            className="admin-input lg:col-span-2"
            name="search"
            placeholder="Search title"
            defaultValue={first(query.search)}
          />
          <select
            className="admin-input"
            name="category"
            defaultValue={first(query.category) ?? ""}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
            name="direction"
            defaultValue={direction ?? ""}
          >
            <option value="">In and out</option>
            <option value="IN">Money in</option>
            <option value="OUT">Money out</option>
          </select>
          <input
            className="admin-input"
            type="date"
            name="from"
            aria-label="From date"
            defaultValue={first(query.from)}
          />
          <input
            className="admin-input"
            type="date"
            name="to"
            aria-label="To date"
            defaultValue={first(query.to)}
          />
          <div className="flex gap-3 lg:col-span-6">
            <button type="submit" className="admin-primary-button">
              Apply filters
            </button>
            <Link
              href="/admin/money/transactions"
              className="admin-secondary-button"
            >
              Clear
            </Link>
          </div>
        </form>

        <div className="mt-5 hidden md:block">
          <MoneyCharts monthly={monthly} categories={categoryChart} />
        </div>

        <section className="admin-panel mt-5 overflow-hidden rounded-2xl">
          <div className="hidden grid-cols-[1.6fr_.8fr_.8fr_.8fr] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-slate-500 md:grid">
            <span>Transaction</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="hidden md:block">
            {descendingPage.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
          <div className="divide-y divide-white/10 md:hidden">
            {ascendingPage.map((transaction) => (
              <MobileTransaction
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
          {transactions.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-400">
              No transactions match these filters.
            </p>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link
            className={`admin-secondary-button ${safePage === 1 ? "pointer-events-none opacity-40" : ""}`}
            href={pageHref(Math.max(1, safePage - 1))}
          >
            Previous
          </Link>
          <span className="text-slate-400">
            Page {safePage} of {totalPages}
          </span>
          <Link
            className={`admin-secondary-button ${safePage === totalPages ? "pointer-events-none opacity-40" : ""}`}
            href={pageHref(Math.min(totalPages, safePage + 1))}
          >
            Next
          </Link>
        </div>

        <FloatingAction href={"/admin/money/transactions/new" as Route}>
          +
        </FloatingAction>
      </PageContainer>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: Readonly<{
  label: string;
  value: string;
  tone?: "positive" | "negative";
}>) {
  return (
    <div className="admin-stat-card">
      <span>{label}</span>
      <strong
        className={cn({
          "text-emerald-300": tone === "positive",
          "text-rose-300": tone === "negative",
        })}
      >
        {value}
      </strong>
    </div>
  );
}

type RowTransaction = Awaited<
  ReturnType<typeof transactionsService.getAll>
>[number];
function TransactionRow({
  transaction,
}: Readonly<{ transaction: RowTransaction }>) {
  return (
    <Link
      href={`/admin/money/transactions/${transaction.id}`}
      className="grid grid-cols-[1.6fr_.8fr_.8fr_.8fr] gap-4 border-b border-white/5 px-5 py-4 text-sm hover:bg-white/5"
    >
      <span className="font-medium">{transaction.title}</span>
      <span className="text-slate-400">{transaction.category.name}</span>
      <span className="text-slate-400">
        {transaction.time.toLocaleDateString("en-SG")}
      </span>
      <span
        className={`text-right font-semibold ${transaction.direction === "IN" ? "text-emerald-300" : "text-rose-300"}`}
      >
        {transaction.direction === "IN" ? "+" : "−"}
        {formatMoney(transaction.amountCents)}
      </span>
    </Link>
  );
}

function MobileTransaction({
  transaction,
}: Readonly<{ transaction: RowTransaction }>) {
  return (
    <Link
      href={`/admin/money/transactions/${transaction.id}`}
      className="flex items-center justify-between gap-4 px-4 py-4"
    >
      <div className="min-w-0">
        <p className="truncate font-medium">{transaction.title}</p>
        <p className="mt-1 text-xs text-slate-500">
          {transaction.time.toLocaleString("en-SG", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
      <span
        className={`shrink-0 font-semibold ${transaction.direction === "IN" ? "text-emerald-300" : "text-rose-300"}`}
      >
        {transaction.direction === "IN" ? "+" : "−"}
        {formatMoney(transaction.amountCents)}
      </span>
    </Link>
  );
}
