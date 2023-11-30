import Image from "next/image";
import styles from "./SocialIcon.module.scss";

const iconSize = 30;

type SocialIconProps = Pick<React.ComponentProps<typeof Image>, "src" | "alt">;

export default function SocialIcon(props: SocialIconProps) {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={iconSize}
      height={iconSize}
      className={styles.icon}
    />
  );
}
