import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME_ADMIN_SESSION,
  COOKIE_NAME_REDIRECTED_FROM,
} from "./constants/cookies.constants";
import { verifySessionToken } from "./services/session-service";

const LOGIN_PATH = "/admin/login";

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const session = await verifySessionToken(
    request.cookies.get(COOKIE_NAME_ADMIN_SESSION)?.value,
  );

  if (pathname === LOGIN_PATH) {
    return session
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (session) return NextResponse.next();

  const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  response.cookies.set(COOKIE_NAME_REDIRECTED_FROM, `${pathname}${search}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 10,
  });
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
