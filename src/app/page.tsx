import {
  SectionIntro,
  SectionMySelf,
  SectionTimeline,
} from "./components/Sections";

export default function Home() {
  return (
    <>
      <SectionIntro />
      <SectionMySelf />
      <SectionTimeline />
    </>
  );
}
