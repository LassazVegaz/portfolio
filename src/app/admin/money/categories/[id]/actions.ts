"use server";
import { revalidatePath } from "next/cache";
import categoriesService, {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/services/categories.service";
import ValidationException from "@/exceptions/validation.exception";

export const deleteAction = async (id: string) => {
  await categoriesService.deleteCategory(id);
  revalidatePath(`/admin/money/categories/${id}`);
  revalidatePath("/admin/money/categories");
};

export const createAction = async (params: CreateCategoryDto) => {
  if (await categoriesService.nameExists(params.name))
    throw new ValidationException("A category with that name already exists.");

  const created = await categoriesService.createCategory(params);
  revalidatePath(`/admin/money/categories/${created.id}`);
  revalidatePath("/admin/money/categories");
  return created.id;
};

export const updateAction = async (id: string, params: UpdateCategoryDto) => {
  if (params.name && (await categoriesService.nameExists(params.name)))
    throw new ValidationException("A category with that name already exists.");

  await categoriesService.updateCategory(id, params);
  revalidatePath(`/admin/money/categories/${id}`);
  revalidatePath("/admin/money/categories");
};

export const getCategoriesForDropdown = async (currentCatId: string) => {
  const categories =
    await categoriesService.getNonChildCategories(currentCatId);
  return categories
    .filter((cat) => cat.id !== currentCatId)
    .map((cat) => ({ id: cat.id, name: cat.name }));
};
