import { formatMoney } from "@/features/money/money";
import transactionsService from "@/services/transactions.service";
import Link from "next/link";

type RowTransaction = Awaited<
  ReturnType<typeof transactionsService.getAll>
>[number];

export function TransactionRow({
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

export function MobileTransaction({
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
