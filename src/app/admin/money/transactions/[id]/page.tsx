import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import categoriesService from "@/services/categories.service";
import transactionsService from "@/services/transactions.service";
import { notFound } from "next/navigation";
import ClientForm from "./components/ClientForm";

export default async function TransactionPage(
  props: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const { id } = await props.params;
  const isNew = id === "new";
  const transaction = isNew ? null : await transactionsService.getById(id);
  if (!isNew && !transaction) notFound();

  const [categories, currentBalanceCents, balanceWithoutTransactionCents] =
    await Promise.all([
      categoriesService.getAllCategories(),
      transactionsService.getBalanceCents(),
      transactionsService.getBalanceCents(transaction?.id),
    ]);

  return (
    <main className="admin-shell min-h-screen pb-10">
      <PageContainer className="mx-auto max-w-3xl px-5">
        <TopNavigator links={["home", "money"]} />
        <p className="admin-eyebrow mt-10">Ledger entry</p>
        <h1 className="mt-2 text-3xl font-semibold">
          {isNew ? "Add transaction" : "Edit transaction"}
        </h1>
        <ClientForm
          isNew={isNew}
          transaction={
            transaction
              ? {
                  id: transaction.id,
                  amountCents: transaction.amountCents,
                  direction: transaction.direction,
                  title: transaction.title,
                  comments: transaction.comments,
                  time: transaction.time,
                  categoryName: transaction.category.name,
                }
              : null
          }
          categories={categories.map(({ id: categoryId, name }) => ({ id: categoryId, name }))}
          currentBalanceCents={currentBalanceCents}
          balanceWithoutTransactionCents={balanceWithoutTransactionCents}
        />
      </PageContainer>
    </main>
  );
}
