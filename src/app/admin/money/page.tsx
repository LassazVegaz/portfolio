import AppCard from "@/components/AppCard";
import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default function MoneyPage() {
  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Money</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/money/transactions">Transactions</AppCard>
        <AppCard href="/admin/money/categories">Categories</AppCard>
      </div>
    </PageContainer>
  );
}
