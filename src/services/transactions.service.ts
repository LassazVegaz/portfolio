import { MoneyValidationError } from "@/features/money/validation-error";
import "server-only";
import { PRIMARY_MONEY_ACCOUNT_ID } from "@/features/money/default-records";
import prisma from "./prisma-service";
import categoriesService from "./categories.service";
import { MAX_MONEY_CENTS } from "@/features/money/money";
import {
  LEDGER_PAGE_SIZE,
  LedgerSort,
  isObjectId,
} from "@/features/money/ledger-filters";
import { Prisma, TransactionDirection } from "@prisma/client";

export type SaveTransactionDto = {
  amountCents: number;
  direction: TransactionDirection;
  title: string;
  comments: string | null;
  counterparty: string | null;
  reference: string | null;
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
  instrumentId?: string;
  minAmountCents?: number;
  maxAmountCents?: number;
};

export class TransactionsService {
  async create(dto: SaveTransactionDto) {
    this.validate(dto);
    await Promise.all([
      categoriesService.requireSelectableCategory(
        dto.categoryId,
        dto.direction,
      ),
      this.requireInstrument(dto.instrumentId),
    ]);
    return prisma.transaction.create({
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        counterparty: dto.counterparty?.trim() || null,
        reference: dto.reference?.trim() || null,
        time: dto.time,
        categoryId: dto.categoryId,
        instrumentId: dto.instrumentId,
      },
    });
  }

  async update(id: string, dto: SaveTransactionDto) {
    this.validate(dto);
    const existing = await this.getById(id);
    if (!existing) throw new MoneyValidationError("Transaction not found.");
    await Promise.all([
      categoriesService.requireSelectableCategory(
        dto.categoryId,
        dto.direction,
        existing.categoryId,
      ),
      this.requireInstrument(dto.instrumentId),
    ]);
    return prisma.transaction.update({
      where: { id },
      data: {
        amountCents: dto.amountCents,
        direction: dto.direction,
        title: dto.title.trim(),
        comments: dto.comments?.trim() || null,
        counterparty: dto.counterparty?.trim() || null,
        reference: dto.reference?.trim() || null,
        time: dto.time,
        categoryId: dto.categoryId,
        instrumentId: dto.instrumentId,
      },
    });
  }

  async delete(id: string) {
    if (!isObjectId(id))
      throw new MoneyValidationError("Invalid transaction ID.");
    await prisma.transaction.delete({ where: { id } });
  }

  async getById(id: string) {
    if (!isObjectId(id)) return null;
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

  async getLedger(
    filters: TransactionFilters,
    requestedPage = 1,
    sort: LedgerSort = "newest",
  ) {
    const where = this.buildWhere(filters);
    const [count, totals] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ["direction"],
        where,
        _sum: { amountCents: true },
      }),
    ]);
    const totalPages = Math.max(1, Math.ceil(count / LEDGER_PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    const orderBy: Prisma.TransactionOrderByWithRelationInput[] =
      sort === "highest" || sort === "lowest"
        ? [
            { amountCents: sort === "highest" ? "desc" : "asc" },
            { time: "desc" },
            { id: "desc" },
          ]
        : [
            { time: sort === "oldest" ? "asc" : "desc" },
            { id: sort === "oldest" ? "asc" : "desc" },
          ];
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip: (page - 1) * LEDGER_PAGE_SIZE,
      take: LEDGER_PAGE_SIZE,
      include: { category: { include: { parent: true } }, instrument: true },
    });
    const incomeCents =
      totals.find((row) => row.direction === "IN")?._sum.amountCents ?? 0;
    const expenseCents =
      totals.find((row) => row.direction === "OUT")?._sum.amountCents ?? 0;
    return { transactions, count, page, totalPages, incomeCents, expenseCents };
  }

  async getOpeningBalanceCents() {
    const account = await prisma.moneyAccount.findUniqueOrThrow({
      where: { id: PRIMARY_MONEY_ACCOUNT_ID },
      select: { openingBalanceCents: true },
    });
    return account.openingBalanceCents;
  }

  async setOpeningBalanceCents(openingBalanceCents: number) {
    if (
      !Number.isSafeInteger(openingBalanceCents) ||
      Math.abs(openingBalanceCents) > MAX_MONEY_CENTS
    ) {
      throw new MoneyValidationError("Opening balance is invalid.");
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
    if (!instrument)
      throw new MoneyValidationError("Choose a valid transaction instrument.");
    return instrument;
  }

  private validate(dto: SaveTransactionDto) {
    if (
      !Number.isSafeInteger(dto.amountCents) ||
      dto.amountCents <= 0 ||
      dto.amountCents > MAX_MONEY_CENTS
    ) {
      throw new MoneyValidationError(
        "Amount must be greater than zero and have at most two decimals.",
      );
    }
    if (!dto.title.trim() || dto.title.trim().length > 120)
      throw new MoneyValidationError("Use a title of 1–120 characters.");
    if (dto.direction !== "IN" && dto.direction !== "OUT")
      throw new MoneyValidationError("Choose a valid direction.");
    if (
      (dto.comments?.length ?? 0) > 500 ||
      (dto.counterparty?.length ?? 0) > 120 ||
      (dto.reference?.length ?? 0) > 120
    )
      throw new MoneyValidationError("Transaction details are too long.");
    if (!isObjectId(dto.categoryId) || !isObjectId(dto.instrumentId))
      throw new MoneyValidationError("Choose a valid category and instrument.");
    if (Number.isNaN(dto.time.getTime()))
      throw new MoneyValidationError("Date is invalid.");
    if (!dto.instrumentId)
      throw new MoneyValidationError("Instrument is required.");
  }

  private buildWhere(
    filters: TransactionFilters,
  ): Prisma.TransactionWhereInput {
    return {
      categoryId: filters.categoryIds?.length
        ? { in: filters.categoryIds }
        : undefined,
      direction: filters.direction,
      instrumentId: filters.instrumentId,
      amountCents: { gte: filters.minAmountCents, lte: filters.maxAmountCents },
      time:
        filters.from || filters.to
          ? { gte: filters.from, lte: filters.to }
          : undefined,
      OR: filters.search
        ? ["title", "comments", "counterparty", "reference"].map((field) => ({
            [field]: { contains: filters.search!.trim(), mode: "insensitive" },
          }))
        : undefined,
    };
  }
}

const transactionsService = new TransactionsService();
export default transactionsService;
