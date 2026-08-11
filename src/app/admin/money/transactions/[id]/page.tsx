import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import categoriesService from "@/services/categories.service";
import transactionsService from "@/services/transactions.service";
import instrumentsService from "@/services/instruments.service";
import { notFound } from "next/navigation";
import ClientForm from "./components/ClientForm";

export default async function TransactionPage(
  props: Readonly<{ params: Promise<{ id: string }> }>,
) {
  const { id } = await props.params;
  const isNew = id === "new";
  const transaction = isNew ? null : await transactionsService.getById(id);
  if (!isNew && !transaction) notFound();

  const [
    categories,
    instruments,
    defaultInstrument,
    currentBalanceCents,
    balanceWithoutTransactionCents,
  ] =
    await Promise.all([
      categoriesService.getSelectableCategories(),
      instrumentsService.getAll(),
      instrumentsService.getDefault(),
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
                  categoryId: transaction.categoryId,
                  instrumentId: transaction.instrumentId,
                }
              : null
          }
          categories={categories.map(({ id: categoryId, name, parent }) => ({
            id: categoryId,
            name,
            parentName: parent?.name ?? null,
          }))}
          defaultCategoryId={
            categories.find(({ isSystem }) => isSystem)!.id
          }
          instruments={instruments.map(({ id: instrumentId, name, isCreditCard }) => ({
            id: instrumentId,
            name,
            isCreditCard,
          }))}
          defaultInstrumentId={defaultInstrument.id}
          currentBalanceCents={currentBalanceCents}
          balanceWithoutTransactionCents={balanceWithoutTransactionCents}
        />
      </PageContainer>
    </main>
  );
}
