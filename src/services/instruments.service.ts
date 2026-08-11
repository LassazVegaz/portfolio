import "server-only";

import { PRIMARY_MONEY_ACCOUNT_ID } from "@/features/money/default-records";
import {
  cleanMoneyName,
  normalizeMoneyName,
} from "@/features/money/names";
import prisma from "./prisma-service";

export type SaveInstrumentDto = {
  name: string;
  isCreditCard: boolean;
};

export class InstrumentsService {
  async getDefault() {
    const account = await prisma.moneyAccount.findUniqueOrThrow({
      where: { id: PRIMARY_MONEY_ACCOUNT_ID },
      include: { defaultInstrument: true },
    });
    return account.defaultInstrument;
  }

  async getAll() {
    return prisma.instrument.findMany({
      include: { _count: { select: { transactions: true } } },
      orderBy: { name: "asc" },
    });
  }

  async getById(id: string) {
    return prisma.instrument.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } },
    });
  }

  async create(dto: SaveInstrumentDto) {
    const name = this.validateName(dto.name);
    return prisma.instrument.create({
      data: {
        name,
        normalizedName: normalizeMoneyName(name),
        isCreditCard: dto.isCreditCard,
      },
    });
  }

  async update(id: string, dto: SaveInstrumentDto) {
    const name = this.validateName(dto.name);
    return prisma.instrument.update({
      where: { id },
      data: {
        name,
        normalizedName: normalizeMoneyName(name),
        isCreditCard: dto.isCreditCard,
      },
    });
  }

  async delete(id: string) {
    const [transactionCount, accountCount] = await Promise.all([
      prisma.transaction.count({ where: { instrumentId: id } }),
      prisma.moneyAccount.count({ where: { defaultInstrumentId: id } }),
    ]);
    if (transactionCount > 0) {
      throw new Error("An instrument used by transactions cannot be deleted.");
    }
    if (accountCount > 0) {
      throw new Error("Choose another default instrument before deleting this one.");
    }
    await prisma.instrument.delete({ where: { id } });
  }

  async setDefault(id: string) {
    const instrument = await prisma.instrument.findUnique({ where: { id } });
    if (!instrument) throw new Error("Instrument not found.");
    await prisma.moneyAccount.update({
      where: { id: PRIMARY_MONEY_ACCOUNT_ID },
      data: { defaultInstrumentId: id },
    });
  }

  async nameExists(name: string, exceptId?: string) {
    return (
      (await prisma.instrument.count({
        where: {
          normalizedName: normalizeMoneyName(name),
          id: exceptId ? { not: exceptId } : undefined,
        },
      })) > 0
    );
  }

  private validateName(value: string) {
    const name = cleanMoneyName(value);
    if (!name) throw new Error("Instrument name is required.");
    if (name.length > 80) throw new Error("Instrument name is too long.");
    return name;
  }
}

const instrumentsService = new InstrumentsService();
export default instrumentsService;
