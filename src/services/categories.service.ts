import { MoneyValidationError } from "@/features/money/validation-error";
import "server-only";

import { cleanMoneyName, normalizeMoneyName } from "@/features/money/names";
import { validateCategoryAssignment } from "@/features/money/category-policy";
import prisma from "./prisma-service";
import { CategoryUsage, TransactionDirection } from "@prisma/client";
import { MAX_MONEY_CENTS } from "@/features/money/money";
import { isObjectId } from "@/features/money/ledger-filters";

export type CreateCategoryDto = {
  name: string;
  description: string | null;
  usage: CategoryUsage;
  isArchived: boolean;
  parentId: string | null;
  monthlyBudgetCents: number;
};
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export class CategoriesService {
  async createCategory(dto: CreateCategoryDto) {
    const name = cleanMoneyName(dto.name);
    if (!name || name.length > 80)
      throw new MoneyValidationError("Use a category name of 1–80 characters.");
    this.validateDetails(dto);
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
        description: dto.description?.trim() || null,
        usage: dto.usage,
        isArchived: dto.isArchived,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const existing = await this.getCategoryById(id);
    if (!existing) throw new MoneyValidationError("Category not found.");
    if (existing.isSystem)
      throw new MoneyValidationError(
        "The Unclassified category cannot be edited.",
      );
    this.validateDetails(dto);
    if (
      dto.usage &&
      dto.usage !== "BOTH" &&
      (await prisma.transaction.count({
        where: { categoryId: id, direction: { not: dto.usage } },
      }))
    ) {
      throw new MoneyValidationError(
        "This category has transactions in the other direction. Keep it available for both directions.",
      );
    }
    if (
      dto.isArchived &&
      (await prisma.category.count({
        where: { parentId: id, isArchived: false },
      }))
    ) {
      throw new MoneyValidationError(
        "Archive the subcategories before archiving their parent.",
      );
    }
    if (dto.parentId === id)
      throw new MoneyValidationError("A category cannot be its own parent.");
    if (dto.parentId && dto.parentId !== existing.parentId)
      await this.validateParent(dto.parentId);
    if (dto.isArchived === false && existing.parentId) {
      const parent = await this.getCategoryById(existing.parentId);
      if (parent?.isArchived)
        throw new MoneyValidationError("Restore the parent category first.");
    }

    const monthlyBudgetCents =
      dto.monthlyBudgetCents ?? existing.monthlyBudgetCents;
    this.validateBudgetValue(monthlyBudgetCents);
    const parentId =
      dto.parentId === undefined ? existing.parentId : dto.parentId;
    if (parentId) {
      if (await this.hasChildCategories(id)) {
        throw new MoneyValidationError(
          "A parent category cannot become a subcategory.",
        );
      }
      await this.validateChildBudget(parentId, monthlyBudgetCents, id);
    } else {
      const childrenBudget = await this.getChildrenBudget(id);
      if (childrenBudget > monthlyBudgetCents) {
        throw new MoneyValidationError(
          "The parent budget cannot be less than the sum of its subcategory budgets.",
        );
      }
    }

    const name = dto.name === undefined ? undefined : cleanMoneyName(dto.name);
    if (name !== undefined && (!name || name.length > 80))
      throw new MoneyValidationError("Category name is required.");

    return prisma.category.update({
      where: { id },
      data: {
        name,
        normalizedName: name ? normalizeMoneyName(name) : undefined,
        parentId: dto.parentId,
        monthlyBudgetCents: dto.monthlyBudgetCents,
        description:
          dto.description === undefined
            ? undefined
            : dto.description?.trim() || null,
        usage: dto.usage,
        isArchived: dto.isArchived,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);
    if (!category) return;
    if (category.isSystem)
      throw new MoneyValidationError(
        "The Unclassified category cannot be deleted.",
      );

    if (
      (await this.hasChildCategories(id)) ||
      (await prisma.transaction.count({ where: { categoryId: id } }))
    ) {
      throw new MoneyValidationError(
        "This category is in use. Archive it to preserve its transaction history.",
      );
    }
    await prisma.category.delete({ where: { id } });
  }

  async getCategoryById(id: string) {
    if (!isObjectId(id)) return null;
    return prisma.category.findUnique({ where: { id } });
  }

  async getAllCategories() {
    return prisma.category.findMany({
      include: { _count: { select: { children: true, transactions: true } } },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    });
  }

  async getSelectableCategories(existingCategoryId?: string) {
    return prisma.category.findMany({
      where: {
        children: { none: {} },
        OR: [
          { isArchived: false },
          ...(existingCategoryId ? [{ id: existingCategoryId }] : []),
        ],
      },
      include: { parent: true },
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    });
  }

  async requireSelectableCategory(
    id: string,
    direction: TransactionDirection,
    existingCategoryId?: string,
  ) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { children: true } } },
    });
    if (!category) throw new MoneyValidationError("Category not found.");
    validateCategoryAssignment(
      { ...category, childCount: category._count.children },
      direction,
      existingCategoryId,
    );
    return category;
  }

  async getAvailableParents(currentId?: string) {
    return prisma.category.findMany({
      where: {
        id: currentId ? { not: currentId } : undefined,
        parentId: null,
        isSystem: false,
        isArchived: false,
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
    if (!parent) throw new MoneyValidationError("Parent category not found.");
    if (parent.isArchived)
      throw new MoneyValidationError(
        "Restore the parent category before using it.",
      );
    if (parent.isSystem)
      throw new MoneyValidationError("Unclassified cannot have subcategories.");
    if (parent.parentId)
      throw new Error("Subcategories cannot have subcategories.");
    if (
      (await prisma.transaction.count({ where: { categoryId: parentId } })) > 0
    ) {
      throw new Error(
        "Move the parent category's transactions before adding a subcategory.",
      );
    }
  }

  private validateDetails(dto: UpdateCategoryDto) {
    if ((dto.description?.length ?? 0) > 500)
      throw new MoneyValidationError(
        "Description must be at most 500 characters.",
      );
    if (dto.usage && !["IN", "OUT", "BOTH"].includes(dto.usage))
      throw new MoneyValidationError("Choose a valid category usage.");
  }

  private validateBudgetValue(monthlyBudgetCents: number) {
    if (!Number.isSafeInteger(monthlyBudgetCents) || monthlyBudgetCents < 0) {
      throw new Error(
        "Monthly budget must be zero or a valid positive amount.",
      );
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
    if (!parent) throw new MoneyValidationError("Parent category not found.");
    const siblingsBudget = await this.getChildrenBudget(parentId, exceptId);
    if (siblingsBudget + monthlyBudgetCents > parent.monthlyBudgetCents) {
      throw new MoneyValidationError(
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
