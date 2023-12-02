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
  console.log("Home page rendered");

  increaseViewCount();

  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
    </>
  );
}
