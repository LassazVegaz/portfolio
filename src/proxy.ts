import { NextRequest, NextResponse } from "next/server";
import authService from "./services/auth-service";
import { Route } from "next";

const publicPaths = new Set<Route>(["/", "/my-story", "/admin/login"]);

const adminPathsStartWith: Route = "/admin";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath = publicPaths.has(pathname as Route);
  const isAdminPath = pathname.startsWith(adminPathsStartWith);

  if (isPublicPath || isAdminPath) {
    const isLoggedIn = await authService.isLoggedIn();

    if (isPublicPath && isLoggedIn) {
      return NextResponse.rewrite(new URL("/admin", req.url));
    } else if (!isLoggedIn) {
      return NextResponse.rewrite(new URL("/admin/login", req.url));
    }
  }
}
