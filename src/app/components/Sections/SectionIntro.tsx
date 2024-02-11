import { AnimateFillingTexts } from "../AnimateFillingTexts";

const SectionIntro = () => (
  <section id="intro" className="h-screen px-[10vw] flow-root">
    <h1 className="font-extrabold mt-[30vh] text-4xl sm:text-6xl">
      Lasindu Nuwanga Weerasinghe
    </h1>
    <h4 className="font-semibold text-xl sm:text-3xl mt-[4vh] dark:text-slate-100">
      Senior Software Engineer
    </h4>

    <AnimateFillingTexts
      texts={[
        "Web Apps Developer",
        "Mobile Apps Developer",
        "Desktop Apps Developer",
      ]}
    />
  </section>
);

export default SectionIntro;
