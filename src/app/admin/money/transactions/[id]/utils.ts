import ValidationException from "@/exceptions/validation.exception";
import { Transaction } from "@/generated/prisma/browser";

type FormEntries = {
  [k in keyof Pick<
    Transaction,
    "amount" | "title" | "comments" | "time"
  >]: string;
};

export const handleKnownExceptions = (error: unknown) => {
  let handled = false;

  if (error instanceof ValidationException) {
    alert(error.message);
    handled = true;
  }

  return handled;
};

export const validateFormEntries = (entries: FormEntries) => {
  if (Number.isNaN(Number.parseFloat(entries.amount)))
    throw new ValidationException("Amount must be a valid number");
};

export const buildFormEntries = (form: HTMLFormElement): FormEntries => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries()) as FormEntries;

  const time = new Date(entries.time);
  entries.time = time.toISOString();

  return entries;
};

export const toLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
