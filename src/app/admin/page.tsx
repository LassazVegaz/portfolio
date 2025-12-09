import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";
import Link from "next/link";
import routingService from "@/services/routing-service";

const AppCard: typeof Link = (props) => (
  <Link
    {...props}
    className="bg-black border-2 border-white rounded p-1 w-32 h-32 flex items-center justify-center text-center md:text-lg font-semibold hover:bg-white hover:text-black transition-all duration-1000 odd:justify-self-end"
  />
);

export default async function AdminPage() {
  await routingService.unauthorizedRedirection();

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Apps</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/stocks-calculator">Stocks Calculator</AppCard>
        <AppCard href="/admin/rent-rooms">Rent Rooms</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
      </div>
    </PageContainer>
  );
}
