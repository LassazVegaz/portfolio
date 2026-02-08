import TopNavigator from "@/components/HomeButton";
import ClientSidePage from "./components/ClientSidePage";

export default async function AdminPage() {
  return (
    <>
      <TopNavigator links={["home"]} />
      <ClientSidePage />
    </>
  );
}
