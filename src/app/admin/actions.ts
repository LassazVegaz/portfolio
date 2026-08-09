"use server";

import authService from "@/services/auth-service";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  await authService.logout();
  redirect("/admin/login");
};
