import Footer from "./components/Footer";
import {
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
      <Footer />
    </>
  );
}
