"use server";
import ts, { CreateTransactionDto } from "@/services/transactions.service";
import { revalidatePath } from "next/cache";

type FormEntries = {
  [k in keyof Pick<
    CreateTransactionDto,
    "amount" | "title" | "comments" | "time"
  >]: string;
};

export const createAction = async (entries: FormEntries) => {
  console.log("time:", entries.time);
  const created = await ts.create({
    amount: Number.parseFloat(entries.amount),
    title: entries.title,
    comments: entries.comments || null,
    time: new Date(entries.time),
    categoryId: null,
  });
  revalidatePath("/admin/money/transactions");
  revalidatePath(`/admin/money/transactions/${created.id}`);
  return created.id;
};

export const updateAction = async (id: string, entries: FormEntries) => {
  await ts.update(id, {
    amount: Number.parseFloat(entries.amount),
    title: entries.title,
    comments: entries.comments || null,
    time: new Date(entries.time),
  });
  revalidatePath("/admin/money/transactions");
  revalidatePath(`/admin/money/transactions/${id}`);
};

export const deleteAction = async (id: string) => {
  await ts.delete(id);
  revalidatePath("/admin/money/transactions");
  revalidatePath(`/admin/money/transactions/${id}`);
};
