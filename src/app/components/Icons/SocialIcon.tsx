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
        className="transition-all duration-300 hover:scale-125 w-[25px] h-[25px] rounded-md p-0.5 dark:bg-slate-500 dark:hover:bg-slate-400"
      />
    </a>
  );
}
