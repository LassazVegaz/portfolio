"use server";
import authService from "@/services/auth-service";
import { redirect } from "next/navigation";

export const loginAction = async (data: FormData) => {
  const username = data.get("username");
  const password = data.get("password");

  if (
    typeof username === "string" &&
    typeof password === "string" &&
    (await authService.login(username, password))
  ) {
    redirect("/admin/stocks-calculator");
  }
};
