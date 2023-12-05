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

export default function Home() {
  increaseViewCount();

  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
      <Footer />
    </>
  );
}
