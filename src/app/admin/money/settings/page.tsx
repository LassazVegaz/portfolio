import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import transactionsService from "@/services/transactions.service";
import BalanceForm from "./BalanceForm";
import instrumentsService from "@/services/instruments.service";
import DefaultInstrumentForm from "./DefaultInstrumentForm";

export default async function MoneySettingsPage() {
  const defaultInstrument = await instrumentsService.getDefault();
  const [openingBalanceCents, instruments] = await Promise.all([
    transactionsService.getOpeningBalanceCents(),
    instrumentsService.getAll(),
  ]);
  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-2xl">
        <TopNavigator links={["home", "money"]} />
        <p className="admin-eyebrow mt-10">Account setup</p>
        <h1 className="mt-2 text-3xl font-semibold">Money settings</h1>
        <div className="mt-page grid gap-page">
          <BalanceForm openingBalanceCents={openingBalanceCents} />
          <DefaultInstrumentForm
            instruments={instruments.map(({ id, name, isCreditCard }) => ({
              id,
              name,
              isCreditCard,
            }))}
            defaultInstrumentId={defaultInstrument.id}
          />
        </div>
      </PageContainer>
    </main>
  );
}
