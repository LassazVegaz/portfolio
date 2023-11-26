import { Box, Typography } from "@mui/material";
import AnimateFillingTexts from "../AnimateFillingTexts";

const SectionIntro = () => (
  <Box height="100vh" display="flow-root">
    <Typography variant="h3" fontWeight={900} ml="10vw" mt="30vh">
      Lasindu Nuwanga Weerasinghe
    </Typography>
    <Typography variant="h4" ml="10vw" mt="5vh">
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
);

export default SectionIntro;
