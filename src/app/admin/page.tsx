import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";
import routingService from "@/services/routing-service";
import AppCard from "@/components/AppCard";

export default async function AdminPage() {
  await routingService.unauthorizedRedirection();

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Apps</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/stocks-calculator">Stocks Calculator</AppCard>
        <AppCard href="/admin/rent-rooms">Rent Rooms</AppCard>
        <AppCard href="/admin/money">Money</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
      </div>
    </PageContainer>
  );
}
