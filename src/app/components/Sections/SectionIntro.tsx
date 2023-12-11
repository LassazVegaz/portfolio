import { AnimateFillingTexts } from "../AnimateFillingTexts";

const SectionIntro = () => (
  <section id="intro" className="h-screen px-[10vw] grid grid-rows-[1fr,auto]">
    <div>
      <h1 className="font-extrabold mt-[30vh] text-4xl sm:text-6xl">
        Lasindu Nuwanga Weerasinghe
      </h1>
      <h4 className="font-bold text-2xl sm:text-4xl mt-[5vh]">
        Senior Software Engineer
      </h4>

      <AnimateFillingTexts
        texts={[
          "Web Apps Developer",
          "Mobile Apps Developer",
          "Desktop Apps Developer",
        ]}
      />
    </div>
  </section>
);

export default SectionIntro;
