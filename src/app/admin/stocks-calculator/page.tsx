import routingService from "@/services/routing-service";
import ClientSidePage from "./components/ClientSidePage";

export default async function AdminPage() {
  await routingService.unauthorizedRedirection();

  return <ClientSidePage />;
}
