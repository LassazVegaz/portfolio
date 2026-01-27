"use server";
import { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import categoriesService from "@/services/categories.service";

type FormDataDto = {
  id?: string;
  name: string;
  parentId: string | null;
  actionType: "save" | "delete";
};

export const formAction = async (_: null | string, form: FormData) => {
  const data = Object.fromEntries(form.entries()) as FormDataDto;
  let routeTo: Route | null = null;

  data.parentId = data.parentId || null;

  try {
    if (data.actionType === "save" && data.id) {
      await categoriesService.updateCategory(data.id, {
        name: data.name,
        parentId: data.parentId,
      });
      revalidatePath(`/admin/money/categories/${data.id}`);
    } else if (data.actionType === "save") {
      const created = await categoriesService.createCategory({
        name: data.name,
        parentId: data.parentId,
      });
      routeTo = `/admin/money/categories/${created.id}` as Route;
    } else if (data.actionType === "delete" && data.id) {
      await categoriesService.deleteCategory(data.id);
      routeTo = "/admin/money/categories";
    }
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else throw error;
  }

  if (routeTo) redirect(routeTo);

  return null;
};
