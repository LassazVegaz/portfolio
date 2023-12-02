import {
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";
import statisticsService from "@/services/statistics.service";

export default function Home() {
  statisticsService.addView().catch((err) => {
    console.error("Error adding a view statistic:");
    console.error(err);
  });

  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
    </>
  );
}
