import { Box, Typography } from "@mui/material";
import { AnimateFillingTexts } from "../AnimateFillingTexts";

const SectionIntro = () => (
  <section id="intro" className="h-screen px-[10vw] grid grid-rows-[1fr,auto]">
    <Box>
      <Typography variant="h3" fontWeight={900} mt="30vh">
        Lasindu Nuwanga Weerasinghe
      </Typography>
      <Typography variant="h4" mt="5vh">
        Senior Software Engineer
      </Typography>

      <AnimateFillingTexts
        texts={[
          "Web Apps Developer",
          "Mobile Apps Developer",
          "Desktop Apps Developer",
        ]}
      />
    </Box>
  </section>
);

export default SectionIntro;
