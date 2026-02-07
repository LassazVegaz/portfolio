import { Transaction } from "@/generated/prisma/client";
import prisma from "./prisma-service";

export type CreateTransactionDto = Omit<Transaction, "id">;
export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export class TransactionsService {
  async create(dto: CreateTransactionDto) {
    const t = await prisma.transaction.create({
      data: dto,
    });
    return t;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const t = await prisma.transaction.update({
      where: { id },
      data: dto,
    });
    return t;
  }

  async delete(id: string) {
    await prisma.transaction.delete({
      where: { id },
    });
  }

  async getById(id: string) {
    const t = await prisma.transaction.findUnique({
      where: { id },
    });
    return t;
  }
}

const transactionsService = new TransactionsService();
export default transactionsService;
