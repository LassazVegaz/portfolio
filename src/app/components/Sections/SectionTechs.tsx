import NextImage from "next/image";
import { SectionTechsAnimator } from "../AnimateFillingTexts";

const imagesCount = 10;
const imgSize = 200;

type TechImageProps = {
  src: React.ComponentProps<typeof NextImage>["src"];
};
const TechImage = (props: TechImageProps) => (
  <div className="w-[200px] h-[200px] flex justify-center items-center">
    <NextImage
      src={props.src}
      alt="Techs"
      width={imgSize}
      height={imgSize}
      style={{ opacity: 0 }}
    />
  </div>
);

const SectionTechs = () => {
  return (
    <>
      <div
        className="min-h-[100vh] p-2 flex flex-wrap justify-around items-center gap-8 relative"
        id="techs-images-container"
      >
        {Array(imagesCount)
          .fill(0)
          .map((_, i) => (
            <TechImage key={i} src={`/${i + 1}.png`} />
          ))}

        <h3
          className="absolute font-black transition-all duration-500 ease-in-out"
          id="techs-text"
        >
          Technologies I Use
        </h3>
      </div>

      <SectionTechsAnimator />
    </>
  );
};

export default SectionTechs;
