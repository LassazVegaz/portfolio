import { Route } from "next";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import homeImg from "../../public/home.png";

type NavigationLink = "home" | "money";

type LinkProps = (
  | {
      type: "image";
      src: StaticImageData;
      alt: string;
    }
  | {
      type: "text";
      content: string;
    }
) & {
  href: Route;
};

const links: Record<NavigationLink, LinkProps> = {
  home: {
    type: "image",
    src: homeImg,
    alt: "home",
    href: "/admin",
  },
  money: {
    type: "text",
    content: "M",
    href: "/admin/money",
  },
};

type LinkButtonProps = {
  linkName: NavigationLink;
};

const NavigationButton = (props: LinkButtonProps) => {
  const link = links[props.linkName];
  return (
    <Link href={link.href} className="p-1.5">
      {link.type === "text" ? (
        <span className="font-bold h-5 w-5 flex items-center justify-center">
          {link.content}
        </span>
      ) : (
        <Image src={link.src} alt={link.alt} className="max-w-5 max-h-5" />
      )}
    </Link>
  );
};

type TopNavigatorProps = {
  links: NavigationLink[];
};

export default function TopNavigator(props: Readonly<TopNavigatorProps>) {
  return (
    <div className="flex absolute top-0 left-0 rounded-br-md border-r border-b">
      {props.links.map((linkName) => (
        <NavigationButton key={linkName} linkName={linkName} />
      ))}
    </div>
  );
}
