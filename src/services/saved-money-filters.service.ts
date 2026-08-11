import "server-only";

import {
  cleanMoneyName,
  normalizeMoneyName,
} from "@/features/money/names";
import { MoneyDateRangePreset, TransactionDirection } from "@prisma/client";
import prisma from "./prisma-service";

export type SaveMoneyFilterDto = {
  name?: string;
  direction: TransactionDirection;
  categoryIds: string[];
  showSubcategories: boolean;
  rangePreset: MoneyDateRangePreset | null;
  from: Date | null;
  to: Date | null;
  showCashflow: boolean;
};

export class SavedMoneyFiltersService {
  async getAll(adminUserId: string) {
    return prisma.savedMoneyFilter.findMany({
      where: { adminUserId },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });
  }

  async create(adminUserId: string, dto: SaveMoneyFilterDto) {
    await this.validate(adminUserId, dto);
    const name = dto.name
      ? await this.requireUniqueName(adminUserId, dto.name)
      : await this.nextDefaultName(adminUserId);
    return prisma.savedMoneyFilter.create({
      data: {
        ...dto,
        categoryIds: [...new Set(dto.categoryIds)],
        name,
        normalizedName: normalizeMoneyName(name),
        adminUserId,
      },
    });
  }

  async rename(adminUserId: string, id: string, nameInput: string) {
    const existing = await prisma.savedMoneyFilter.findFirst({
      where: { id, adminUserId },
    });
    if (!existing) throw new Error("Saved filter not found.");
    const name = await this.requireUniqueName(adminUserId, nameInput, id);
    return prisma.savedMoneyFilter.update({
      where: { id },
      data: { name, normalizedName: normalizeMoneyName(name) },
    });
  }

  async delete(adminUserId: string, id: string) {
    await prisma.savedMoneyFilter.deleteMany({ where: { id, adminUserId } });
  }

  private async validate(adminUserId: string, dto: SaveMoneyFilterDto) {
    const categoryIds = [...new Set(dto.categoryIds)];
    if (categoryIds.length > 10) {
      throw new Error("A filter can contain at most 10 categories.");
    }
    if (categoryIds.length) {
      const count = await prisma.category.count({
        where: { id: { in: categoryIds } },
      });
      if (count !== categoryIds.length) {
        throw new Error("One or more selected categories no longer exist.");
      }
    }
    if (!dto.rangePreset && (!dto.from || !dto.to)) {
      throw new Error("Choose a complete date range.");
    }
    if (dto.from && dto.to && dto.from > dto.to) {
      throw new Error("The start date must be before the end date.");
    }
    if (!adminUserId) throw new Error("An authenticated user is required.");
  }

  private async requireUniqueName(
    adminUserId: string,
    value: string,
    exceptId?: string,
  ) {
    const name = cleanMoneyName(value);
    if (!name) throw new Error("Filter name is required.");
    if (name.length > 80) throw new Error("Filter name is too long.");
    const exists = await prisma.savedMoneyFilter.count({
      where: {
        adminUserId,
        normalizedName: normalizeMoneyName(name),
        id: exceptId ? { not: exceptId } : undefined,
      },
    });
    if (exists) throw new Error("A saved filter already uses that name.");
    return name;
  }

  private async nextDefaultName(adminUserId: string) {
    const existing = await prisma.savedMoneyFilter.findMany({
      where: { adminUserId },
      select: { normalizedName: true },
    });
    const names = new Set(existing.map(({ normalizedName }) => normalizedName));
    let number = 1;
    while (names.has(`filter ${number}`)) number += 1;
    return `Filter ${number}`;
  }
}

const savedMoneyFiltersService = new SavedMoneyFiltersService();
export default savedMoneyFiltersService;
