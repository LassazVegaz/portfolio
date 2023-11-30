import { Box, Typography } from "@mui/material";
import { AnimateFillingTexts } from "../AnimateFillingTexts";
import fbIcon from "@/assets/icons/facebook-f.svg";
import whatsappIcon from "@/assets/icons/whatsapp.svg";
import githubIcon from "@/assets/icons/github.svg";
import linkedinIcon from "@/assets/icons/linkedin-in.svg";
import twitterIcon from "@/assets/icons/x-twitter.svg";
import discordIcon from "@/assets/icons/discord.svg";
import SocialIcon from "../SocialIcon";

const SectionIntro = () => (
  <Box height="100vh" display="flow-root" pl="10vw">
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

    <Box mt={5} display="flex" gap={5}>
      <SocialIcon src={fbIcon} alt="Facebook" />
      <SocialIcon src={whatsappIcon} alt="WhatsApp" />
      <SocialIcon src={githubIcon} alt="GitHub" />
      <SocialIcon src={linkedinIcon} alt="LinkedIn" />
      <SocialIcon src={twitterIcon} alt="Twitter" />
      <SocialIcon src={discordIcon} alt="Discord" />
    </Box>
  </Box>
);

export default SectionIntro;
