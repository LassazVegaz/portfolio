import FloatingAction from "@/components/FloatingAction";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default function MoneyPage() {
  return (
    <PageContainer>
      <Header1>Transactions</Header1>

      <FloatingAction href="/admin/money/categories/new">+</FloatingAction>
    </PageContainer>
  );
}
