import "server-only";

import prisma from "./prisma-service";

export const UNCLASSIFIED_CATEGORY_NAME = "Unclassified";

export type CreateCategoryDto = {
  name: string;
  parentId: string | null;
};
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

const normalizeName = (name: string) =>
  name.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");

const cleanName = (name: string) => name.trim().replace(/\s+/g, " ");

export class CategoriesService {
  async ensureUnclassified() {
    const normalizedName = normalizeName(UNCLASSIFIED_CATEGORY_NAME);
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { normalizedName },
          { name: { equals: UNCLASSIFIED_CATEGORY_NAME, mode: "insensitive" } },
        ],
      },
    });
    if (existing) {
      return prisma.category.update({
        where: { id: existing.id },
        data: { normalizedName, isSystem: true, parentId: null },
      });
    }
    return prisma.category.create({
      data: { name: UNCLASSIFIED_CATEGORY_NAME, normalizedName, isSystem: true },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const name = cleanName(dto.name);
    if (!name) throw new Error("Category name is required.");
    if (dto.parentId) await this.validateParent(dto.parentId);

    return prisma.category.create({
      data: {
        name,
        normalizedName: normalizeName(name),
        parentId: dto.parentId,
      },
    });
  }

  async findOrCreateByName(nameInput?: string | null) {
    const name = cleanName(nameInput ?? "");
    if (!name) return this.ensureUnclassified();

    const normalizedName = normalizeName(name);
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { normalizedName },
          { name: { equals: name, mode: "insensitive" } },
        ],
      },
    });
    return existing ?? prisma.category.create({ data: { name, normalizedName } });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existing = await this.getCategoryById(id);
    if (!existing) throw new Error("Category not found.");
    if (existing.isSystem) throw new Error("The Unclassified category cannot be edited.");
    if (dto.parentId === id) throw new Error("A category cannot be its own parent.");
    if (dto.parentId) await this.validateParent(dto.parentId);

    const name = dto.name === undefined ? undefined : cleanName(dto.name);
    if (name !== undefined && !name) throw new Error("Category name is required.");

    return prisma.category.update({
      where: { id },
      data: {
        name,
        normalizedName: name ? normalizeName(name) : undefined,
        parentId: dto.parentId,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);
    if (!category) return;
    if (category.isSystem) throw new Error("The Unclassified category cannot be deleted.");

    const unclassified = await this.ensureUnclassified();
    await prisma.transaction.updateMany({
      where: { categoryId: id },
      data: { categoryId: unclassified.id },
    });
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });
    await prisma.category.delete({ where: { id } });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  async getAllCategories() {
    await this.ensureUnclassified();
    return prisma.category.findMany({
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    });
  }

  async getAvailableParents(currentId?: string) {
    return prisma.category.findMany({
      where: {
        id: currentId ? { not: currentId } : undefined,
        parentId: null,
        isSystem: false,
      },
      orderBy: { name: "asc" },
    });
  }

  async hasChildCategories(id: string) {
    return (await prisma.category.count({ where: { parentId: id } })) > 0;
  }

  async nameExists(name: string, exceptId?: string) {
    return (
      (await prisma.category.count({
        where: {
          OR: [
            { normalizedName: normalizeName(name) },
            { name: { equals: cleanName(name), mode: "insensitive" } },
          ],
          id: exceptId ? { not: exceptId } : undefined,
        },
      })) > 0
    );
  }

  private async validateParent(parentId: string) {
    const parent = await this.getCategoryById(parentId);
    if (!parent) throw new Error("Parent category not found.");
    if (parent.isSystem) throw new Error("Unclassified cannot have subcategories.");
    if (parent.parentId) throw new Error("Subcategories cannot have subcategories.");
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;
