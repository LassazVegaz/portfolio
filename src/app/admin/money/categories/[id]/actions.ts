"use server";
import categoriesService from "@/services/categories.service";
import { redirect } from "next/navigation";

type FormDataDto = {
  id: string;
  name: string;
  parentId: string | null;
  save?: string;
  delete?: string;
};

export async function formAction(prevState: null, form: FormData) {
  const data = Object.fromEntries(form.entries()) as FormDataDto;

  data.parentId = data.parentId || null;

  if (data.save && data.id === "new") {
    const created = await categoriesService.createCategory({
      name: data.name,
      parentId: data.parentId,
    });
    redirect(`/admin/money/categories/${created.id}`);
  } else if (data.save) {
    await categoriesService.updateCategory(data.id, {
      name: data.name,
      parentId: data.parentId,
    });
  } else if (data.delete) {
    await categoriesService.deleteCategory(data.id);
    redirect("/admin/money/categories");
  }

  return null;
}
