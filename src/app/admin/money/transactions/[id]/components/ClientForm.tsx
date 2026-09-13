"use client";

import Form from "@/components/Form";
import {
  applyTransaction,
  formatMoney,
  MoneyDirection,
  parseMoneyToCents,
} from "@/features/money/money";
import { useRouter } from "next/navigation";
import { SubmitEventHandler, useMemo, useState } from "react";
import { createAction, deleteAction, updateAction } from "../actions";
import { toLocalISOString } from "../utils";

type TransactionFormValue = {
  id: string;
  amountCents: number;
  direction: MoneyDirection;
  title: string;
  comments: string | null;
  counterparty: string | null;
  reference: string | null;
  time: Date;
  categoryId: string;
  instrumentId: string;
};

type Props = {
  isNew: boolean;
  transaction?: TransactionFormValue | null;
  categories: {
    id: string;
    name: string;
    parentName: string | null;
    usage: "IN" | "OUT" | "BOTH";
    isArchived: boolean;
  }[];
  defaultCategoryId: string;
  instruments: { id: string; name: string; isCreditCard: boolean }[];
  defaultInstrumentId: string;
  currentBalanceCents: number;
  balanceWithoutTransactionCents: number;
};

export default function ClientForm(props: Readonly<Props>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(
    props.transaction ? (props.transaction.amountCents / 100).toFixed(2) : "",
  );
  const [direction, setDirection] = useState<MoneyDirection>(
    props.transaction?.direction ?? "OUT",
  );
  const [categoryId, setCategoryId] = useState(
    props.transaction?.categoryId ?? props.defaultCategoryId,
  );
  const selectableCategories = props.categories.filter(
    (category) => category.usage === "BOTH" || category.usage === direction,
  );
  const selectedCategoryId = selectableCategories.some(
    ({ id }) => id === categoryId,
  )
    ? categoryId
    : props.defaultCategoryId;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  const balanceAfterCents = useMemo(() => {
    try {
      const amountCents = amount ? parseMoneyToCents(amount) : 0;
      return applyTransaction(
        props.balanceWithoutTransactionCents,
        amountCents,
        direction,
      );
    } catch {
      return props.balanceWithoutTransactionCents;
    }
  }, [amount, direction, props.balanceWithoutTransactionCents]);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(undefined);
    setSaved(false);
    try {
      const entries = Object.fromEntries(
        new FormData(event.currentTarget).entries(),
      ) as Record<string, string>;
      const id = props.transaction?.id;
      if (id) {
        const result = await updateAction(id, entries);
        if (!result.success) throw new Error(result.error);
        setSaved(true);
      } else {
        const result = await createAction(entries);
        if (!result.success) throw new Error(result.error);
        router.push(`/admin/money/transactions/${result.data}`);
      }
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save transaction.",
      );
    } finally {
      setPending(false);
    }
  };

  const onDelete = async () => {
    if (!props.transaction || !confirm("Delete this transaction?")) return;
    setPending(true);
    try {
      const result = await deleteAction(props.transaction.id);
      if (!result.success) throw new Error(result.error);
      router.push("/admin/money/transactions");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not delete transaction.",
      );
      setPending(false);
    }
  };

  return (
    <>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="admin-stat-card">
          <span>Current balance</span>
          <strong>{formatMoney(props.currentBalanceCents)}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Balance after save</span>
          <strong
            className={
              balanceAfterCents < 0 ? "text-rose-300" : "text-emerald-300"
            }
          >
            {formatMoney(balanceAfterCents)}
          </strong>
        </div>
      </div>

      <Form
        onSubmit={onSubmit}
        className="admin-panel mt-5 grid gap-5 rounded-2xl p-5 sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
          <label className="grid gap-2 text-sm font-medium">
            Amount (SGD)
            <input
              className="admin-input"
              inputMode="decimal"
              name="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Direction
            <select
              className="admin-input"
              name="direction"
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as MoneyDirection)
              }
            >
              <option value="OUT">Money out</option>
              <option value="IN">Money in</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium">
          Title
          <input
            className="admin-input"
            name="title"
            required
            maxLength={120}
            defaultValue={props.transaction?.title}
            placeholder="Groceries, salary, rent…"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Category
          <select
            className="admin-input"
            name="categoryId"
            value={selectedCategoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            {selectableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parentName
                  ? `${category.parentName} / ${category.name}`
                  : category.name}
                {category.isArchived ? " (archived)" : ""}
              </option>
            ))}
          </select>
          <span className="text-xs text-admin-muted">
            Choose a category for this direction. Categories with subcategories
            are used for grouping.
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Source or destination
          <select
            className="admin-input"
            name="instrumentId"
            defaultValue={
              props.transaction?.instrumentId ?? props.defaultInstrumentId
            }
            required
          >
            {props.instruments.map((instrument) => (
              <option key={instrument.id} value={instrument.id}>
                {instrument.name}
                {instrument.isCreditCard ? " · credit card" : ""}
              </option>
            ))}
          </select>
          <span className="text-xs text-admin-muted">
            Instruments describe how money moved; they do not keep separate
            balances.
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Date and time (Singapore)
          <input
            className="admin-input"
            type="datetime-local"
            name="time"
            required
            defaultValue={toLocalISOString(
              props.transaction?.time ?? new Date(),
            )}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid min-w-0 gap-2 text-sm font-medium">
            {direction === "IN" ? "Payer" : "Payee"} (optional)
            <input
              className="admin-input"
              name="counterparty"
              maxLength={120}
              defaultValue={props.transaction?.counterparty ?? ""}
              placeholder="Person or business"
            />
          </label>
          <label className="grid min-w-0 gap-2 text-sm font-medium">
            Reference (optional)
            <input
              className="admin-input"
              name="reference"
              maxLength={120}
              defaultValue={props.transaction?.reference ?? ""}
              placeholder="Receipt, invoice or bank reference"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium">
          Notes
          <textarea
            className="admin-input min-h-24 resize-y"
            name="comments"
            maxLength={500}
            defaultValue={props.transaction?.comments ?? ""}
          />
        </label>

        {saved && (
          <p role="status" className="text-sm text-emerald-300">
            Transaction saved.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-between gap-3 pt-2">
          <button
            type="button"
            className="admin-secondary-button"
            disabled={pending}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <div className="flex gap-3">
            {!props.isNew && (
              <button
                type="button"
                className="admin-danger-button"
                onClick={onDelete}
                disabled={pending}
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="admin-primary-button"
              disabled={pending}
            >
              {pending ? "Saving…" : "Save transaction"}
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
