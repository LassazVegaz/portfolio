import Image from "next/image";
import styles from "./SocialIcon.module.scss";

const iconSize = 20;

type SocialIconProps = Pick<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  link?: string;
};

export default function SocialIcon(props: SocialIconProps) {
  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {
        <Image
          src={props.src}
          alt={props.alt}
          width={iconSize}
          height={iconSize}
          className={styles.icon}
        />
      }
    </a>
  );
}
