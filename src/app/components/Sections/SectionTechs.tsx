import { Box } from "@mui/material";
import NextImage from "next/image";

type TechImageProps = {
  src: React.ComponentProps<typeof NextImage>["src"];
};
const TechImage = (props: TechImageProps) => (
  <NextImage src={props.src} alt="Techs" width={200} height={200} />
);

const SectionTechs = () => {
  return (
    <Box
      id="techs-images-container"
      height="100vh"
      p={2}
      display="flex"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="center"
      gap={8}
    >
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <TechImage key={i} src={`/${i + 1}.png`} />
        ))}
    </Box>
  );
};

export default SectionTechs;
