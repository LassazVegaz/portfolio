"use server";

import authService from "@/services/auth-service";
import { parseMoneyToCents } from "@/features/money/money";
import categoriesService from "@/services/categories.service";
import { revalidatePath } from "next/cache";

export const deleteAction = async (id: string) => {
  await authService.requireAuthenticatedUser();
  await categoriesService.deleteCategory(id);
  revalidatePath("/admin/money/categories");
  revalidatePath("/admin/money/transactions");
};

type CategoryInput = {
  name: string;
  parentId: string | null;
  monthlyBudget: string;
};

const parse = (params: CategoryInput) => ({
  name: params.name,
  parentId: params.parentId,
  monthlyBudgetCents: parseMoneyToCents(params.monthlyBudget),
});

export const createAction = async (input: CategoryInput) => {
  await authService.requireAuthenticatedUser();
  const params = parse(input);
  if (await categoriesService.nameExists(params.name)) {
    throw new Error("A category with that name already exists.");
  }
  const created = await categoriesService.createCategory(params);
  revalidatePath("/admin/money/categories");
  return created.id;
};

export const updateAction = async (id: string, input: CategoryInput) => {
  await authService.requireAuthenticatedUser();
  const params = parse(input);
  if (params.name && (await categoriesService.nameExists(params.name, id))) {
    throw new Error("A category with that name already exists.");
  }
  await categoriesService.updateCategory(id, params);
  revalidatePath("/admin/money/categories");
  revalidatePath("/admin/money/transactions");
};
