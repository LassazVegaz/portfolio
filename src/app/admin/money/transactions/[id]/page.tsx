import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import ClientForm from "./components/ClientForm";
import ts from "@/services/transactions.service";

export default async function TransactionPage(
  props: Readonly<PageProps<"/admin/money/transactions/[id]">>,
) {
  const { id } = await props.params;

  const isNew = id === "new";

  const transaction = isNew ? null : await ts.getById(id);

  return (
    <PageContainer className="px-5">
      <Header1>A Transaction</Header1>

      <ClientForm isNew={isNew} transaction={transaction} />
    </PageContainer>
  );
}
