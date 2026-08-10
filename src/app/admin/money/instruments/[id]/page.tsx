import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import instrumentsService from "@/services/instruments.service";
import { notFound } from "next/navigation";
import ClientForm from "./ClientForm";

export default async function InstrumentPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const isNew = id === "new";
  const instrument = isNew ? null : await instrumentsService.getById(id);
  if (!isNew && !instrument) notFound();

  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-2xl">
        <TopNavigator links={["home", "money"]} />
        <p className="admin-eyebrow mt-10">Money settings</p>
        <h1 className="mt-2 text-3xl font-semibold">
          {isNew ? "New instrument" : instrument?.name}
        </h1>
        <ClientForm
          instrument={
            instrument
              ? {
                  id: instrument.id,
                  name: instrument.name,
                  isCreditCard: instrument.isCreditCard,
                  transactionCount: instrument._count.transactions,
                }
              : null
          }
        />
      </PageContainer>
    </main>
  );
}
