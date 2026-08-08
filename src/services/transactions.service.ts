import "server-only";

import { TransactionDirection } from "@/generated/prisma/client";
import prisma from "./prisma-service";
import categoriesService from "./categories.service";

const PRIMARY_ACCOUNT_ID = "primary";

export type SaveTransactionDto = {
  amountCents: number;
  direction: TransactionDirection;
  title: string;
  comments: string | null;
  time: Date;
  categoryId?: string | null;
  categoryName?: string | null;
};

export type TransactionFilters = {
  categoryId?: string;
  direction?: TransactionDirection;
  from?: Date;
  to?: Date;
  search?: string;
};

export class TransactionsService {
  async create(dto: SaveTransactionDto) {
    this.validate(dto);
    const categoryId = await this.resolveCategory(dto);
    return prisma.transaction.create({
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        time: dto.time,
        categoryId,
      },
    });
  }

  async update(id: string, dto: SaveTransactionDto) {
    this.validate(dto);
    const categoryId = await this.resolveCategory(dto);
    return prisma.transaction.update({
      where: { id },
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        time: dto.time,
        categoryId,
      },
    });
  }

  async delete(id: string) {
    await prisma.transaction.delete({ where: { id } });
  }

  async getById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
    return transaction ? this.normalizeLegacyTransaction(transaction) : null;
  }

  async getAll(filters: TransactionFilters = {}) {
    const transactions = await prisma.transaction.findMany({
      where: this.buildWhere(filters),
      include: { category: true },
      orderBy: [{ time: "desc" }, { createdAt: "desc" }],
    });
    return Promise.all(
      transactions.map((transaction) => this.normalizeLegacyTransaction(transaction)),
    );
  }

  async getOpeningBalanceCents() {
    const account = await prisma.moneyAccount.upsert({
      where: { id: PRIMARY_ACCOUNT_ID },
      create: { id: PRIMARY_ACCOUNT_ID },
      update: {},
    });
    return account.openingBalanceCents;
  }

  async setOpeningBalanceCents(openingBalanceCents: number) {
    if (!Number.isSafeInteger(openingBalanceCents)) {
      throw new Error("Opening balance is invalid.");
    }
    return prisma.moneyAccount.upsert({
      where: { id: PRIMARY_ACCOUNT_ID },
      create: { id: PRIMARY_ACCOUNT_ID, openingBalanceCents },
      update: { openingBalanceCents },
    });
  }

  async getBalanceCents(excludingTransactionId?: string) {
    await this.migrateLegacyTransactions();
    const [openingBalanceCents, incoming, outgoing] = await Promise.all([
      this.getOpeningBalanceCents(),
      prisma.transaction.aggregate({
        where: {
          direction: "IN",
          id: excludingTransactionId ? { not: excludingTransactionId } : undefined,
        },
        _sum: { amountCents: true },
      }),
      prisma.transaction.aggregate({
        where: {
          direction: "OUT",
          id: excludingTransactionId ? { not: excludingTransactionId } : undefined,
        },
        _sum: { amountCents: true },
      }),
    ]);

    return (
      openingBalanceCents +
      (incoming._sum.amountCents ?? 0) -
      (outgoing._sum.amountCents ?? 0)
    );
  }

  private async resolveCategory(dto: SaveTransactionDto) {
    if (dto.categoryId) {
      const category = await categoriesService.getCategoryById(dto.categoryId);
      if (category) return category.id;
    }
    return (await categoriesService.findOrCreateByName(dto.categoryName)).id;
  }

  private validate(dto: SaveTransactionDto) {
    if (!Number.isSafeInteger(dto.amountCents) || dto.amountCents <= 0) {
      throw new Error("Amount must be greater than zero and have at most two decimals.");
    }
    if (!dto.title.trim()) throw new Error("Title is required.");
    if (Number.isNaN(dto.time.getTime())) throw new Error("Date is invalid.");
  }

  private async migrateLegacyTransactions() {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
    });
    await Promise.all(
      transactions
        .filter(
          (transaction) =>
            transaction.amountCents === null ||
            transaction.direction === null ||
            transaction.category === null,
        )
        .map((transaction) => this.normalizeLegacyTransaction(transaction)),
    );
  }

  private async normalizeLegacyTransaction(
    transaction: Awaited<
      ReturnType<typeof prisma.transaction.findMany<{ include: { category: true } }>>
    >[number],
  ) {
    if (
      transaction.amountCents !== null &&
      transaction.direction !== null &&
      transaction.category !== null
    ) {
      return {
        ...transaction,
        amountCents: transaction.amountCents,
        direction: transaction.direction,
        category: transaction.category,
      };
    }

    const category = transaction.category ?? (await categoriesService.ensureUnclassified());
    const legacyAmount = transaction.amount ?? 0;
    return prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        amountCents: transaction.amountCents ?? Math.abs(Math.round(legacyAmount * 100)),
        direction: transaction.direction ?? "OUT",
        categoryId: category.id,
      },
      include: { category: true },
    }) as Promise<
      typeof transaction & {
        amountCents: number;
        direction: TransactionDirection;
        category: NonNullable<typeof transaction.category>;
      }
    >;
  }

  private buildWhere(filters: TransactionFilters) {
    return {
      categoryId: filters.categoryId || undefined,
      direction: filters.direction,
      time:
        filters.from || filters.to
          ? { gte: filters.from, lte: filters.to }
          : undefined,
      title: filters.search
        ? { contains: filters.search.trim(), mode: "insensitive" as const }
        : undefined,
    };
  }
}

const transactionsService = new TransactionsService();
export default transactionsService;
