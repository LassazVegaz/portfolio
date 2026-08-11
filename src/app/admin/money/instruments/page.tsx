import FloatingAction from "@/components/FloatingAction";
import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import instrumentsService from "@/services/instruments.service";
import Link from "next/link";
import { Route } from "next";

export default async function InstrumentsPage() {
  const [defaultInstrument, instruments] = await Promise.all([
    instrumentsService.getDefault(),
    instrumentsService.getAll(),
  ]);

  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-4xl">
        <TopNavigator links={["home", "money"]} />
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="admin-eyebrow">Sources and destinations</p>
            <h1 className="mt-2 text-3xl font-semibold">Instruments</h1>
          </div>
          <span className="text-sm text-admin-muted">
            {instruments.length} total
          </span>
        </div>
        <div className="mt-page grid gap-3">
          {instruments.map((instrument) => (
            <Link
              key={instrument.id}
              href={`/admin/money/instruments/${instrument.id}`}
              className="admin-panel flex items-center justify-between rounded-admin p-page hover:border-admin-accent/40"
            >
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  {instrument.name}
                  {instrument.id === defaultInstrument.id && (
                    <span className="admin-badge">Default</span>
                  )}
                  {instrument.isCreditCard && (
                    <span className="admin-chip">Credit card</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-admin-muted">
                  {instrument._count.transactions} transaction
                  {instrument._count.transactions === 1 ? "" : "s"}
                </p>
              </div>
              <span aria-hidden="true" className="text-admin-muted">
                →
              </span>
            </Link>
          ))}
        </div>
        <FloatingAction href={"/admin/money/instruments/new" as Route}>+</FloatingAction>
      </PageContainer>
    </main>
  );
}
