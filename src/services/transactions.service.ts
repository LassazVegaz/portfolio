import "server-only";
import { PRIMARY_MONEY_ACCOUNT_ID } from "@/features/money/default-records";
import prisma from "./prisma-service";
import categoriesService from "./categories.service";
import { TransactionDirection } from "@prisma/client";

export type SaveTransactionDto = {
  amountCents: number;
  direction: TransactionDirection;
  title: string;
  comments: string | null;
  time: Date;
  categoryId: string;
  instrumentId: string;
};

export type TransactionFilters = {
  categoryIds?: string[];
  direction?: TransactionDirection;
  from?: Date;
  to?: Date;
  search?: string;
};

export class TransactionsService {
  async create(dto: SaveTransactionDto) {
    this.validate(dto);
    await Promise.all([
      categoriesService.requireSelectableCategory(dto.categoryId),
      this.requireInstrument(dto.instrumentId),
    ]);
    return prisma.transaction.create({
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        time: dto.time,
        categoryId: dto.categoryId,
        instrumentId: dto.instrumentId,
      },
    });
  }

  async update(id: string, dto: SaveTransactionDto) {
    this.validate(dto);
    await Promise.all([
      categoriesService.requireSelectableCategory(dto.categoryId),
      this.requireInstrument(dto.instrumentId),
    ]);
    return prisma.transaction.update({
      where: { id },
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        time: dto.time,
        categoryId: dto.categoryId,
        instrumentId: dto.instrumentId,
      },
    });
  }

  async delete(id: string) {
    await prisma.transaction.delete({ where: { id } });
  }

  async getById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { category: true, instrument: true },
    });
  }

  async getAll(filters: TransactionFilters = {}) {
    return prisma.transaction.findMany({
      where: this.buildWhere(filters),
      include: {
        category: { include: { parent: true } },
        instrument: true,
      },
      orderBy: [{ time: "desc" }, { createdAt: "desc" }],
    });
  }

  async getOpeningBalanceCents() {
    const account = await prisma.moneyAccount.findUniqueOrThrow({
      where: { id: PRIMARY_MONEY_ACCOUNT_ID },
      select: { openingBalanceCents: true },
    });
    return account.openingBalanceCents;
  }

  async setOpeningBalanceCents(openingBalanceCents: number) {
    if (!Number.isSafeInteger(openingBalanceCents)) {
      throw new TypeError("Opening balance is invalid.");
    }
    return prisma.moneyAccount.update({
      where: { id: PRIMARY_MONEY_ACCOUNT_ID },
      data: { openingBalanceCents },
    });
  }

  async getBalanceCents(excludingTransactionId?: string) {
    const [openingBalanceCents, incoming, outgoing] = await Promise.all([
      this.getOpeningBalanceCents(),
      prisma.transaction.aggregate({
        where: {
          direction: "IN",
          id: excludingTransactionId
            ? { not: excludingTransactionId }
            : undefined,
        },
        _sum: { amountCents: true },
      }),
      prisma.transaction.aggregate({
        where: {
          direction: "OUT",
          id: excludingTransactionId
            ? { not: excludingTransactionId }
            : undefined,
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

  private async requireInstrument(id: string) {
    const instrument = await prisma.instrument.findUnique({ where: { id } });
    if (!instrument) throw new Error("Choose a valid transaction instrument.");
    return instrument;
  }

  private validate(dto: SaveTransactionDto) {
    if (!Number.isSafeInteger(dto.amountCents) || dto.amountCents <= 0) {
      throw new Error(
        "Amount must be greater than zero and have at most two decimals.",
      );
    }
    if (!dto.title.trim()) throw new Error("Title is required.");
    if (Number.isNaN(dto.time.getTime())) throw new Error("Date is invalid.");
    if (!dto.instrumentId) throw new Error("Instrument is required.");
  }

  private buildWhere(filters: TransactionFilters) {
    return {
      categoryId: filters.categoryIds?.length
        ? { in: filters.categoryIds }
        : undefined,
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
