import { Category } from "@/generated/prisma/client";
import prisma from "./prisma-service";

export type CreateCategoryDto = Pick<Category, "name" | "parentId">;

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export class CategoriesService {
  async createCategory(dto: CreateCategoryDto) {
    const c = await prisma.category.create({
      data: dto,
    });

    return c;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    if (dto.parentId !== undefined && dto.parentId === id)
      throw new Error("A category cannot be its own parent.");

    const c = await prisma.category.update({
      where: { id },
      data: dto,
    });
    return c;
  }

  async deleteCategory(id: string) {
    await prisma.category.delete({
      where: { id },
    });
  }

  async getCategoryById(id: string) {
    const c = await prisma.category.findUnique({
      where: { id },
    });
    return c;
  }

  async getAllCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;
