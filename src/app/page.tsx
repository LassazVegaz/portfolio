import routingService from "@/services/routing-service";
import Footer from "./components/Footer";
import {
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";

export default async function Home() {
  // if admin is logged in, directly send the admin to relevant admin page
  await routingService.authorizedRedirection();

  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
      <Footer />
    </>
  );
}
