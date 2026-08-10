import AppCard from "@/components/AppCard";
import Header1 from "@/components/Header1";
import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";

export default function MoneyPage() {
  return (
    <main className="admin-shell min-h-screen">
    <PageContainer className="mx-auto grid max-w-4xl grid-rows-[auto_auto_1fr] gap-8">
      <TopNavigator links={["home"]} />

      <Header1>Money</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/money/transactions">Transactions</AppCard>
        <AppCard href="/admin/money/categories">Categories</AppCard>
        <AppCard href="/admin/money/instruments">Instruments</AppCard>
        <AppCard href="/admin/money/settings">Settings</AppCard>
      </div>
    </PageContainer>
    </main>
  );
}
