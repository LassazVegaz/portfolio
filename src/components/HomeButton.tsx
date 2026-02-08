import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type NavigationLink = "home" | "money";

type LinkProps = (
  | {
      type: "image";
      src: string;
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
    src: "/home.png",
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
        <span className="font-bold h-6 w-6 flex items-center justify-center">
          {link.content}
        </span>
      ) : (
        <Image src={link.src} width={24} height={24} alt={link.alt} />
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
