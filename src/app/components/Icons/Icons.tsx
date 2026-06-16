import SocialIcon from "./SocialIcon";
import githubIcon from "@/assets/icons/github.svg";
import linkedinIcon from "@/assets/icons/linkedin-in.svg";
import twitterIcon from "@/assets/icons/x-twitter.svg";
import discordIcon from "@/assets/icons/discord.svg";

const Icons = (props: React.ComponentProps<"div">) => (
  <div {...props}>
    {/*
    My girlfriend probably doesnt want me to publish my number 🤣
    <SocialIcon 
      src={whatsappIcon}
      alt="WhatsApp"
      link="https://wa.me/+94774556607"
    /> */}
    <SocialIcon
      src={githubIcon}
      alt="GitHub"
      link="https://github.com/LassazVegaz"
    />
    <SocialIcon
      src={linkedinIcon}
      alt="LinkedIn"
      link="https://www.linkedin.com/in/lasindu-weerasinghe"
    />
    <SocialIcon
      src={twitterIcon}
      alt="Twitter"
      link="https://twitter.com/lassi2k"
    />
    <SocialIcon
      src={discordIcon}
      alt="Discord"
      link="https://discordapp.com/users/7715"
    />
  </div>
);

export default Icons;
