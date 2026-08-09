export const COOKIE_NAME_REDIRECTED_FROM = "redirected-from";
export const COOKIE_NAME_ADMIN_SESSION = "admin-session";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
