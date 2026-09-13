import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { MoneyValidationError } from "./validation-error";

export type MoneyActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

/** Authentication must run before this helper so Next.js redirects propagate. */
export async function runMoneyAction<T>(
  operation: () => Promise<T>,
): Promise<MoneyActionResult<T>> {
  try {
    return { success: true, data: await operation() };
  } catch (cause) {
    if (cause instanceof MoneyValidationError)
      return { success: false, error: cause.message };
    if (cause instanceof ZodError)
      return {
        success: false,
        error: cause.issues[0]?.message ?? "Check the form values.",
      };
    if (cause instanceof Prisma.PrismaClientKnownRequestError) {
      if (cause.code === "P2002")
        return {
          success: false,
          error: "A record with that name already exists.",
        };
      if (cause.code === "P2025")
        return {
          success: false,
          error: "This record no longer exists. Refresh and try again.",
        };
    }
    console.error("Money action failed", cause);
    return {
      success: false,
      error: "Could not save your changes. Please try again.",
    };
  }
}
