"use server";

import { parseMoneyToCents } from "@/features/money/money";
import authService from "@/services/auth-service";
import transactionsService from "@/services/transactions.service";
import instrumentsService from "@/services/instruments.service";
import { revalidatePath } from "next/cache";

export type BalanceState = { error?: string; success?: string };

export const updateOpeningBalanceAction = async (
  _previousState: BalanceState,
  formData: FormData,
): Promise<BalanceState> => {
  await authService.requireAuthenticatedUser();
  const value = formData.get("openingBalance");
  if (typeof value !== "string") return { error: "Enter an opening balance." };

  try {
    await transactionsService.setOpeningBalanceCents(
      parseMoneyToCents(value, true),
    );
    revalidatePath("/admin/money");
    revalidatePath("/admin/money/transactions");
    return { success: "Opening balance updated." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not update balance." };
  }
};

export const updateDefaultInstrumentAction = async (
  _previousState: BalanceState,
  formData: FormData,
): Promise<BalanceState> => {
  await authService.requireAuthenticatedUser();
  const id = formData.get("defaultInstrumentId");
  if (typeof id !== "string" || !id) {
    return { error: "Choose a default instrument." };
  }
  try {
    await instrumentsService.setDefault(id);
    revalidatePath("/admin/money/settings");
    revalidatePath("/admin/money/transactions/new");
    return { success: "Default instrument updated." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not update instrument.",
    };
  }
};
