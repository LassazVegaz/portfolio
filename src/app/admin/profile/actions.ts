"use server";

import authService, { AuthenticationError } from "@/services/auth-service";
import { z } from "zod";

export type ProfileState = { error?: string; success?: string };

const profileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must have at least 3 characters.")
      .max(80)
      .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, dashes or underscores."),
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().max(200),
    confirmPassword: z.string().max(200),
  })
  .superRefine((data, context) => {
    if (data.newPassword && data.newPassword.length < 12) {
      context.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "A new password must have at least 12 characters.",
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "The new passwords do not match.",
      });
    }
  });

export const updateProfileAction = async (
  _previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> => {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  try {
    await authService.updateProfile({
      username: parsed.data.username,
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword || undefined,
    });
    return { success: "Profile updated. Other signed-in sessions are now invalid." };
  } catch (error) {
    if (error instanceof AuthenticationError) return { error: error.message };
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique constraint")
    ) {
      return { error: "That username is already in use." };
    }
    return { error: "The profile could not be updated." };
  }
};
