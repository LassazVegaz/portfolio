import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import transactionsService from "@/services/transactions.service";
import BalanceForm from "./BalanceForm";

export default async function MoneySettingsPage() {
  const openingBalanceCents = await transactionsService.getOpeningBalanceCents();
  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-2xl">
        <TopNavigator links={["home", "money"]} />
        <p className="admin-eyebrow mt-10">Account setup</p>
        <h1 className="mt-2 text-3xl font-semibold">Opening balance</h1>
        <BalanceForm openingBalanceCents={openingBalanceCents} />
      </PageContainer>
    </main>
  );
}
