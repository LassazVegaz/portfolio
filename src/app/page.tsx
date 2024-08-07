import Footer from "./components/Footer";
import {
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";
import statisticsService from "@/services/statistics.service";

export const dynamic = "force-dynamic";

const increaseViewCount = async () => {
  try {
    await statisticsService.addView();
  } catch (err) {
    console.error("Error adding a view statistic:");
    console.error(err);
  }
};

export default async function Home() {
  await increaseViewCount();

  return <h1>Hi! Sorry I am down for a while :)</h1>;

  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
      <Footer />
    </>
  );
}
