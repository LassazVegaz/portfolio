"use server";

import { runMoneyAction } from "@/features/money/action-result";
import { MoneyValidationError } from "@/features/money/validation-error";
import authService from "@/services/auth-service";
import { parseMoneyToCents } from "@/features/money/money";
import categoriesService from "@/services/categories.service";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const deleteAction = async (id: string) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    await categoriesService.deleteCategory(id);
    revalidatePath("/admin/money", "layout");
  });
};

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500),
  usage: z.enum(["IN", "OUT", "BOTH"]),
  isArchived: z.boolean(),
  parentId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .nullable(),
  monthlyBudget: z.string(),
});
type CategoryInput = z.infer<typeof categorySchema>;
const parse = (input: CategoryInput) => {
  const params = categorySchema.parse(input);
  return {
    ...params,
    monthlyBudgetCents: parseMoneyToCents(params.monthlyBudget),
  };
};

export const createAction = async (input: CategoryInput) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    const params = parse(input);
    if (await categoriesService.nameExists(params.name)) {
      throw new MoneyValidationError(
        "A category with that name already exists.",
      );
    }
    const created = await categoriesService.createCategory(params);
    revalidatePath("/admin/money", "layout");
    return created.id;
  });
};

export const updateAction = async (id: string, input: CategoryInput) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    const params = parse(input);
    if (params.name && (await categoriesService.nameExists(params.name, id))) {
      throw new MoneyValidationError(
        "A category with that name already exists.",
      );
    }
    await categoriesService.updateCategory(id, params);
    revalidatePath("/admin/money", "layout");
  });
};
