import { Box } from "@mui/material";
import NextImage from "next/image";
import SectionTechsAnimator from "./SectionTechsAnimator";

const imagesCount = 10;
const imgSize = 200;

type TechImageProps = {
  src: React.ComponentProps<typeof NextImage>["src"];
};
const TechImage = (props: TechImageProps) => (
  <Box
    width={imgSize}
    height={imgSize}
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <NextImage
      src={props.src}
      alt="Techs"
      width={imgSize}
      height={imgSize}
      style={{ opacity: 0 }}
    />
  </Box>
);

const SectionTechs = () => {
  return (
    <>
      <Box
        id="techs-images-container"
        minHeight="100vh"
        p={2}
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        alignItems="center"
        gap={8}
      >
        {Array(imagesCount)
          .fill(0)
          .map((_, i) => (
            <TechImage key={i} src={`/${i + 1}.png`} />
          ))}
      </Box>
      <SectionTechsAnimator />
    </>
  );
};

export default SectionTechs;
