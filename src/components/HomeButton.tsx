import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Route } from "next";

type NavigationLink = "home" | "money";

const links: Record<NavigationLink, { href: Route; label: string }> = {
  home: { href: "/admin", label: "Apps" },
  money: { href: "/admin/money", label: "Money" },
};

type TopNavigatorProps = {
  links?: NavigationLink[];
};

export default function TopNavigator({
  links: visibleLinks = ["home"],
}: Readonly<TopNavigatorProps>) {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <div className="flex items-center gap-1">
        {visibleLinks.map((linkName) => (
          <Link
            key={linkName}
            href={links[linkName].href}
            className="admin-nav-link"
          >
            {links[linkName].label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <Link href="/admin/profile" className="admin-nav-link">
          Profile
        </Link>
        <form action={logoutAction}>
          <button className="admin-nav-link cursor-pointer" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
