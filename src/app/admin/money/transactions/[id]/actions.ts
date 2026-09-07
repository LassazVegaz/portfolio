"use server";

import { parseMoneyDateTime } from "@/features/money/date-ranges";
import { parseMoneyToCents } from "@/features/money/money";
import { runMoneyAction } from "@/features/money/action-result";
import authService from "@/services/auth-service";
import transactionsService from "@/services/transactions.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.string().min(1),
  direction: z.enum(["IN", "OUT"]),
  title: z.string().trim().min(1).max(120),
  counterparty: z.string().trim().max(120),
  reference: z.string().trim().max(120),
  comments: z.string().trim().max(500),
  time: z.string().min(1),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i),
  instrumentId: z.string().regex(/^[a-f\d]{24}$/i),
});

const parseEntries = (entries: Record<string, string>) => {
  const parsed = transactionSchema.parse(entries);
  const time = parseMoneyDateTime(parsed.time);
  return {
    amountCents: parseMoneyToCents(parsed.amount),
    direction: parsed.direction,
    title: parsed.title,
    comments: parsed.comments || null,
    counterparty: parsed.counterparty || null,
    reference: parsed.reference || null,
    time,
    categoryId: parsed.categoryId,
    instrumentId: parsed.instrumentId,
  };
};

export const createAction = async (entries: Record<string, string>) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    const created = await transactionsService.create(parseEntries(entries));
    revalidateMoney();
    return created.id;
  });
};

export const updateAction = async (
  id: string,
  entries: Record<string, string>,
) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    await transactionsService.update(id, parseEntries(entries));
    revalidateMoney();
  });
};

export const deleteAction = async (id: string) => {
  await authService.requireAuthenticatedUser();
  return runMoneyAction(async () => {
    await transactionsService.delete(id);
    revalidateMoney();
  });
};

const revalidateMoney = () => {
  revalidatePath("/admin/money", "layout");
};
