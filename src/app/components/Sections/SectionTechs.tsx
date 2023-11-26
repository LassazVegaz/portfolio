import { Box } from "@mui/material";
import Image from "next/image";
import dotnetImg from "@/assets/dotnet.png";

const SectionTechs = () => {
  return (
    <Box height="100vh">
      <Image src={dotnetImg} alt="Techs" width={200} height={200} />
    </Box>
  );
};

export default SectionTechs;
