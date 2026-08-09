"use server";

import authService from "@/services/auth-service";
import categoriesService, {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/services/categories.service";
import { revalidatePath } from "next/cache";

export const deleteAction = async (id: string) => {
  await authService.requireAuthenticatedUser();
  await categoriesService.deleteCategory(id);
  revalidatePath("/admin/money/categories");
  revalidatePath("/admin/money/transactions");
};

export const createAction = async (params: CreateCategoryDto) => {
  await authService.requireAuthenticatedUser();
  if (await categoriesService.nameExists(params.name)) {
    throw new Error("A category with that name already exists.");
  }
  const created = await categoriesService.createCategory(params);
  revalidatePath("/admin/money/categories");
  return created.id;
};

export const updateAction = async (id: string, params: UpdateCategoryDto) => {
  await authService.requireAuthenticatedUser();
  if (params.name && (await categoriesService.nameExists(params.name, id))) {
    throw new Error("A category with that name already exists.");
  }
  await categoriesService.updateCategory(id, params);
  revalidatePath("/admin/money/categories");
  revalidatePath("/admin/money/transactions");
};
