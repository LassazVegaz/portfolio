import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";
import Link from "next/link";

const AppCard = (props: { href: string; children: React.ReactNode }) => (
  <Link
    href={props.href}
    className="dark:bg-black border-2 dark:border-white rounded p-1 w-32 h-32 flex items-center text-center md:text-lg font-semibold hover:dark:bg-white hover:dark:text-black transition-all duration-1000 odd:justify-self-end"
  >
    {props.children}
  </Link>
);

export default function AdminPage() {
  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Apps</Header1>

      <div className="grid grid-cols-2 gap-4 items-center">
        <AppCard href="/admin/stocks-calculator">Stocks Calculator</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
        <AppCard href="/admin">Comming Soon</AppCard>
      </div>
    </PageContainer>
  );
}
