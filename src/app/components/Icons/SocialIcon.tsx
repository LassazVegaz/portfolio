import Image from "next/image";

const iconSize = 20;

type SocialIconProps = Pick<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  link?: string;
};

export default function SocialIcon(props: SocialIconProps) {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <Image
        src={props.src}
        alt={props.alt}
        width={iconSize}
        height={iconSize}
        className="social-icon-image"
      />
    </a>
  );
}
