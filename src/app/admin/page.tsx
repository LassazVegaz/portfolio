import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";
import AppCard from "@/components/AppCard";
import TopNavigator from "@/components/HomeButton";

export default async function AdminPage() {
  return (
    <PageContainer className="admin-shell grid min-h-screen grid-rows-[auto_auto_1fr] gap-8">
      <TopNavigator links={[]} />
      <Header1>Apps</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/stocks-calculator">Stocks Calculator</AppCard>
        <AppCard href="/admin/rent-rooms">Rent Rooms</AppCard>
        <AppCard href="/admin/money">Money</AppCard>
        <AppCard href="/admin/profile">Profile</AppCard>
      </div>
    </PageContainer>
  );
}
