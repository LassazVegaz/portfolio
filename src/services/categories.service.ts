import "server-only";

import { UNCLASSIFIED_CATEGORY_NAME } from "@/features/money/default-records";
import {
  cleanMoneyName,
  normalizeMoneyName,
} from "@/features/money/names";
import prisma from "./prisma-service";

export type CreateCategoryDto = {
  name: string;
  parentId: string | null;
  monthlyBudgetCents: number;
};
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export class CategoriesService {
  async createCategory(dto: CreateCategoryDto) {
    const name = cleanMoneyName(dto.name);
    if (!name) throw new Error("Category name is required.");
    this.validateBudgetValue(dto.monthlyBudgetCents);
    if (dto.parentId) {
      await this.validateParent(dto.parentId);
      await this.validateChildBudget(dto.parentId, dto.monthlyBudgetCents);
    }

    return prisma.category.create({
      data: {
        name,
        normalizedName: normalizeMoneyName(name),
        parentId: dto.parentId,
        monthlyBudgetCents: dto.monthlyBudgetCents,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existing = await this.getCategoryById(id);
    if (!existing) throw new Error("Category not found.");
    if (existing.isSystem)
      throw new Error("The Unclassified category cannot be edited.");
    if (dto.parentId === id)
      throw new Error("A category cannot be its own parent.");
    if (dto.parentId) await this.validateParent(dto.parentId);

    const monthlyBudgetCents =
      dto.monthlyBudgetCents ?? existing.monthlyBudgetCents;
    this.validateBudgetValue(monthlyBudgetCents);
    const parentId =
      dto.parentId === undefined ? existing.parentId : dto.parentId;
    if (parentId) {
      if (await this.hasChildCategories(id)) {
        throw new Error("A parent category cannot become a subcategory.");
      }
      await this.validateChildBudget(parentId, monthlyBudgetCents, id);
    } else {
      const childrenBudget = await this.getChildrenBudget(id);
      if (childrenBudget > monthlyBudgetCents) {
        throw new Error(
          "The parent budget cannot be less than the sum of its subcategory budgets.",
        );
      }
    }

    const name =
      dto.name === undefined ? undefined : cleanMoneyName(dto.name);
    if (name !== undefined && !name)
      throw new Error("Category name is required.");

    return prisma.category.update({
      where: { id },
      data: {
        name,
        normalizedName: name ? normalizeMoneyName(name) : undefined,
        parentId: dto.parentId,
        monthlyBudgetCents: dto.monthlyBudgetCents,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);
    if (!category) return;
    if (category.isSystem)
      throw new Error("The Unclassified category cannot be deleted.");

    const unclassified = await prisma.category.findUniqueOrThrow({
      where: {
        normalizedName: normalizeMoneyName(UNCLASSIFIED_CATEGORY_NAME),
      },
    });
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
    return prisma.category.findMany({
      include: { _count: { select: { children: true, transactions: true } } },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    });
  }

  async getSelectableCategories() {
    return prisma.category.findMany({
      where: {
        OR: [{ isSystem: true }, { parentId: { not: null } }],
      },
      include: { parent: true },
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    });
  }

  async requireSelectableCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new Error("Category not found.");
    if (!category.isSystem && !category.parentId) {
      throw new Error("Choose a subcategory instead of a parent category.");
    }
    return category;
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
          normalizedName: normalizeMoneyName(name),
          id: exceptId ? { not: exceptId } : undefined,
        },
      })) > 0
    );
  }

  private async validateParent(parentId: string) {
    const parent = await this.getCategoryById(parentId);
    if (!parent) throw new Error("Parent category not found.");
    if (parent.isSystem)
      throw new Error("Unclassified cannot have subcategories.");
    if (parent.parentId)
      throw new Error("Subcategories cannot have subcategories.");
    if ((await prisma.transaction.count({ where: { categoryId: parentId } })) > 0) {
      throw new Error(
        "Move the parent category's transactions before adding a subcategory.",
      );
    }
  }

  private validateBudgetValue(monthlyBudgetCents: number) {
    if (!Number.isSafeInteger(monthlyBudgetCents) || monthlyBudgetCents < 0) {
      throw new Error("Monthly budget must be zero or a valid positive amount.");
    }
  }

  private async getChildrenBudget(parentId: string, exceptId?: string) {
    const result = await prisma.category.aggregate({
      where: {
        parentId,
        id: exceptId ? { not: exceptId } : undefined,
      },
      _sum: { monthlyBudgetCents: true },
    });
    return result._sum.monthlyBudgetCents ?? 0;
  }

  private async validateChildBudget(
    parentId: string,
    monthlyBudgetCents: number,
    exceptId?: string,
  ) {
    const parent = await this.getCategoryById(parentId);
    if (!parent) throw new Error("Parent category not found.");
    const siblingsBudget = await this.getChildrenBudget(parentId, exceptId);
    if (siblingsBudget + monthlyBudgetCents > parent.monthlyBudgetCents) {
      throw new Error(
        "Subcategory budgets cannot exceed the parent category's monthly budget.",
      );
    }
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;

/**
 * NOTES:
 * When creating categories don't leave parentId to undefined. This is to keep the DB consistent
 */
