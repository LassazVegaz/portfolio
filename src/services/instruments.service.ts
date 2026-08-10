import "server-only";

import prisma from "./prisma-service";

const PRIMARY_ACCOUNT_ID = "primary";
const DEFAULT_INSTRUMENT_NAME = "Cash";

const cleanName = (name: string) => name.trim().replace(/\s+/g, " ");
const normalizeName = (name: string) => cleanName(name).toLocaleLowerCase("en-US");

export type SaveInstrumentDto = {
  name: string;
  isCreditCard: boolean;
};

export class InstrumentsService {
  async ensureDefaultInstrument() {
    const account = await prisma.moneyAccount.upsert({
      where: { id: PRIMARY_ACCOUNT_ID },
      create: { id: PRIMARY_ACCOUNT_ID },
      update: {},
      include: { defaultInstrument: true },
    });
    if (account.defaultInstrument) return account.defaultInstrument;

    const normalizedName = normalizeName(DEFAULT_INSTRUMENT_NAME);
    const instrument = await prisma.instrument.upsert({
      where: { normalizedName },
      create: {
        name: DEFAULT_INSTRUMENT_NAME,
        normalizedName,
      },
      update: {},
    });
    await prisma.moneyAccount.update({
      where: { id: PRIMARY_ACCOUNT_ID },
      data: { defaultInstrumentId: instrument.id },
    });
    return instrument;
  }

  async getAll() {
    await this.ensureDefaultInstrument();
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

  async getDefault() {
    return this.ensureDefaultInstrument();
  }

  async create(dto: SaveInstrumentDto) {
    const name = this.validateName(dto.name);
    return prisma.instrument.create({
      data: {
        name,
        normalizedName: normalizeName(name),
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
        normalizedName: normalizeName(name),
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
    await prisma.moneyAccount.upsert({
      where: { id: PRIMARY_ACCOUNT_ID },
      create: { id: PRIMARY_ACCOUNT_ID, defaultInstrumentId: id },
      update: { defaultInstrumentId: id },
    });
  }

  async nameExists(name: string, exceptId?: string) {
    return (
      (await prisma.instrument.count({
        where: {
          normalizedName: normalizeName(name),
          id: exceptId ? { not: exceptId } : undefined,
        },
      })) > 0
    );
  }

  private validateName(value: string) {
    const name = cleanName(value);
    if (!name) throw new Error("Instrument name is required.");
    if (name.length > 80) throw new Error("Instrument name is too long.");
    return name;
  }
}

const instrumentsService = new InstrumentsService();
export default instrumentsService;
