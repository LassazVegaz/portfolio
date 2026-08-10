"use server";

import authService from "@/services/auth-service";
import instrumentsService from "@/services/instruments.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const instrumentSchema = z.object({
  name: z.string().trim().min(1).max(80),
  isCreditCard: z.boolean(),
});

const parse = (input: { name: string; isCreditCard: boolean }) =>
  instrumentSchema.parse(input);

export const createAction = async (input: {
  name: string;
  isCreditCard: boolean;
}) => {
  await authService.requireAuthenticatedUser();
  const dto = parse(input);
  if (await instrumentsService.nameExists(dto.name)) {
    throw new Error("An instrument with that name already exists.");
  }
  const created = await instrumentsService.create(dto);
  revalidatePath("/admin/money/instruments");
  return created.id;
};

export const updateAction = async (
  id: string,
  input: { name: string; isCreditCard: boolean },
) => {
  await authService.requireAuthenticatedUser();
  const dto = parse(input);
  if (await instrumentsService.nameExists(dto.name, id)) {
    throw new Error("An instrument with that name already exists.");
  }
  await instrumentsService.update(id, dto);
  revalidatePath("/admin/money/instruments");
  revalidatePath("/admin/money/transactions");
};

export const deleteAction = async (id: string) => {
  await authService.requireAuthenticatedUser();
  await instrumentsService.delete(id);
  revalidatePath("/admin/money/instruments");
};
