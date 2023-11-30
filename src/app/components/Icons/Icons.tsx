import { Box, BoxProps } from "@mui/material";
import SocialIcon from "./SocialIcon";
import fbIcon from "@/assets/icons/facebook-f.svg";
import whatsappIcon from "@/assets/icons/whatsapp.svg";
import githubIcon from "@/assets/icons/github.svg";
import linkedinIcon from "@/assets/icons/linkedin-in.svg";
import twitterIcon from "@/assets/icons/x-twitter.svg";
import discordIcon from "@/assets/icons/discord.svg";

const Icons = (props: BoxProps) => (
  <Box {...props}>
    <SocialIcon src={whatsappIcon} alt="WhatsApp" />
    <SocialIcon src={githubIcon} alt="GitHub" />
    <SocialIcon src={linkedinIcon} alt="LinkedIn" />
    <SocialIcon src={twitterIcon} alt="Twitter" />
    <SocialIcon src={discordIcon} alt="Discord" />
    <SocialIcon
      src={fbIcon}
      alt="Facebook"
      link="https://web.facebook.com/lasindu.nuwanga.5"
    />
  </Box>
);

export default Icons;
