"use server";
import { revalidatePath } from "next/cache";
import categoriesService, {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/services/categories.service";

export const deleteAction = async (id: string) => {
  await categoriesService.deleteCategory(id);
  revalidatePath(`/admin/money/categories/${id}`);
  revalidatePath("/admin/money/categories");
};

export const createAction = async (params: CreateCategoryDto) => {
  const created = await categoriesService.createCategory(params);
  revalidatePath(`/admin/money/categories/${created.id}`);
  revalidatePath("/admin/money/categories");
  return created.id;
};

export const updateAction = async (id: string, params: UpdateCategoryDto) => {
  await categoriesService.updateCategory(id, params);
  revalidatePath(`/admin/money/categories/${id}`);
  revalidatePath("/admin/money/categories");
};

export const getCategoriesForDropdown = async (currentCatId: string) => {
  const categories =
    await categoriesService.getNonChildCategories(currentCatId);
  return categories.map((cat) => ({ id: cat.id, name: cat.name }));
};
