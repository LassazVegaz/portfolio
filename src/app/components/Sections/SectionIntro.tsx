import { Box, Typography } from "@mui/material";
import { AnimateFillingTexts } from "../AnimateFillingTexts";
import { Icons } from "../Icons";

const SectionIntro = () => (
  <Box height="100vh" px="10vw" display="grid" gridTemplateRows="1fr auto">
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
  </Box>
);

export default SectionIntro;
