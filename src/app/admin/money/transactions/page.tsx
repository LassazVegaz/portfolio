import FloatingAction from "@/components/FloatingAction";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import ts from "@/services/transactions.service";
import Link from "next/link";

export default async function MoneyPage() {
  const transactions = await ts.getAll();

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] gap-6 max-h-screen">
      <Header1>Transactions</Header1>

      <div className="flex flex-col space-y-4 overflow-y-auto mb-4">
        {transactions.map((t) => (
          <Link
            key={t.id}
            href={`/admin/money/transactions/${t.id}`}
            className="p-4 border border-gray-200 rounded-md flex justify-between"
          >
            <span>{t.title}</span>
            <span>{t.amount.toFixed(2)}</span>
          </Link>
        ))}
      </div>

      <FloatingAction href="/admin/money/transactions/new">+</FloatingAction>
    </PageContainer>
  );
}
