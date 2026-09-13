import { MoneyValidationError } from "./validation-error";
export const MAX_MONEY_CENTS = 2_147_483_647;

export type MoneyDirection = "IN" | "OUT";

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 2,
  }).format(cents / 100);

export const parseMoneyToCents = (value: string, allowNegative = false) => {
  const cleaned = value.trim();
  const pattern = allowNegative ? /^-?\d+(\.\d{1,2})?$/ : /^\d+(\.\d{1,2})?$/;
  if (!pattern.test(cleaned)) {
    throw new MoneyValidationError(
      "Use a valid SGD amount with no more than two decimals.",
    );
  }
  const cents = Math.round(Number(cleaned) * 100);
  if (!Number.isSafeInteger(cents) || Math.abs(cents) > MAX_MONEY_CENTS)
    throw new MoneyValidationError("The amount is too large.");
  return cents;
};

export const applyTransaction = (
  balanceCents: number,
  amountCents: number,
  direction: MoneyDirection,
) => balanceCents + (direction === "IN" ? amountCents : -amountCents);
