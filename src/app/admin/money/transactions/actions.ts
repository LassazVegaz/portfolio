"use server";

import {
  isMoneyDatePreset,
  parseMoneyDateEnd,
  parseMoneyDateStart,
} from "@/features/money/date-ranges";
import authService from "@/services/auth-service";
import savedMoneyFiltersService from "@/services/saved-money-filters.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const filterSchema = z.object({
  name: z.string().trim().max(80).optional(),
  direction: z.enum(["IN", "OUT"]),
  categoryIds: z.array(z.string()).max(10),
  showSubcategories: z.boolean(),
  rangePreset: z.string().nullable(),
  from: z.string().nullable(),
  to: z.string().nullable(),
  showCashflow: z.boolean(),
});

export type SavedFilterInput = z.infer<typeof filterSchema>;

export const saveFilterAction = async (input: SavedFilterInput) => {
  const user = await authService.requireAuthenticatedUser();
  const parsed = filterSchema.parse(input);
  if (parsed.rangePreset && !isMoneyDatePreset(parsed.rangePreset)) {
    throw new Error("Choose a valid predefined date range.");
  }
  const rangePreset =
    parsed.rangePreset && isMoneyDatePreset(parsed.rangePreset)
      ? parsed.rangePreset
      : null;
  const saved = await savedMoneyFiltersService.create(user.id, {
    name: parsed.name,
    direction: parsed.direction,
    categoryIds: parsed.categoryIds,
    showSubcategories: parsed.showSubcategories,
    rangePreset,
    from: rangePreset ? null : (parseMoneyDateStart(parsed.from ?? undefined) ?? null),
    to: rangePreset ? null : (parseMoneyDateEnd(parsed.to ?? undefined) ?? null),
    showCashflow: parsed.showCashflow,
  });
  revalidatePath("/admin/money/transactions");
  return { id: saved.id, name: saved.name };
};

export const renameFilterAction = async (id: string, name: string) => {
  const user = await authService.requireAuthenticatedUser();
  await savedMoneyFiltersService.rename(user.id, id, name);
  revalidatePath("/admin/money/transactions");
};

export const deleteFilterAction = async (id: string) => {
  const user = await authService.requireAuthenticatedUser();
  await savedMoneyFiltersService.delete(user.id, id);
  revalidatePath("/admin/money/transactions");
};
