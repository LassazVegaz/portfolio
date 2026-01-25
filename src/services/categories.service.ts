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
    if (dto.parentId) await this.validateParentCategory(id, dto.parentId);

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

  /**
   * Validates that the parent category does not create a circular reference.
   */
  private async validateParentCategory(categoryId: string, parentId: string) {
    let currentParentId = parentId;
    while (currentParentId) {
      if (currentParentId === categoryId) {
        throw new Error("A category cannot be its own parent.");
      }
      const parentCategory = await this.getCategoryById(currentParentId);
      if (!parentCategory) break;
      currentParentId = parentCategory.parentId!;
    }
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;
