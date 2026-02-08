"use server";
import { COOKIE_NAME_REDIRECTED_FROM } from "@/constants/cookies.constants";
import authService from "@/services/auth-service";
import { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (data: FormData) => {
  const username = data.get("username");
  const password = data.get("password");

  if (
    typeof username === "string" &&
    typeof password === "string" &&
    (await authService.login(username, password))
  ) {
    const c = await cookies();
    const redirectedFrom = c.get(COOKIE_NAME_REDIRECTED_FROM)?.value as
      | Route
      | undefined;
    c.delete(COOKIE_NAME_REDIRECTED_FROM);
    redirect(redirectedFrom || "/admin");
  }
};
