"use server";
import { COOKIE_NAME_REDIRECTED_FROM } from "@/constants/cookies.constants";
import authService from "@/services/auth-service";
import { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export type LoginState = { error?: string };

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
});

export const loginAction = async (
  _previousState: LoginState,
  data: FormData,
): Promise<LoginState> => {
  const parsed = loginSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { error: "Enter your username and password." };

  if (!(await authService.login(parsed.data.username, parsed.data.password)))
    return { error: "Invalid username or password." };

  const c = await cookies();
  const requestedPath = c.get(COOKIE_NAME_REDIRECTED_FROM)?.value;
  c.delete(COOKIE_NAME_REDIRECTED_FROM);
  const redirectedFrom =
    requestedPath?.startsWith("/admin") && !requestedPath.startsWith("//")
      ? (requestedPath as Route)
      : "/admin";
  redirect(redirectedFrom);
};
