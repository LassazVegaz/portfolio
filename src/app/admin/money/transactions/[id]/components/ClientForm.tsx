"use client";

import Form from "@/components/Form";
import {
  applyTransaction,
  formatMoney,
  MoneyDirection,
  parseMoneyToCents,
} from "@/features/money/money";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createAction, deleteAction, updateAction } from "../actions";
import { toLocalISOString } from "../utils";

type TransactionFormValue = {
  id: string;
  amountCents: number;
  direction: MoneyDirection;
  title: string;
  comments: string | null;
  time: Date;
  categoryName: string;
};

type Props = {
  isNew: boolean;
  transaction?: TransactionFormValue | null;
  categories: { id: string; name: string }[];
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
  const [categoryName, setCategoryName] = useState(
    props.transaction?.categoryName ?? "",
  );
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

  const categoryExists = props.categories.some(
    (category) => category.name.toLowerCase() === categoryName.trim().toLowerCase(),
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    try {
      const entries = Object.fromEntries(
        new FormData(event.currentTarget).entries(),
      ) as Record<string, string>;
      const id = props.transaction?.id;
      if (id) await updateAction(id, entries);
      else router.push(`/admin/money/transactions/${await createAction(entries)}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save transaction.");
    } finally {
      setPending(false);
    }
  };

  const onDelete = async () => {
    if (!props.transaction || !confirm("Delete this transaction?")) return;
    setPending(true);
    try {
      await deleteAction(props.transaction.id);
      router.push("/admin/money/transactions");
    } catch {
      setError("Could not delete transaction.");
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
          <strong className={balanceAfterCents < 0 ? "text-rose-300" : "text-emerald-300"}>
            {formatMoney(balanceAfterCents)}
          </strong>
        </div>
      </div>

      <Form onSubmit={onSubmit} className="admin-panel mt-5 grid gap-5 rounded-2xl p-5 sm:p-7">
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
              onChange={(event) => setDirection(event.target.value as MoneyDirection)}
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
          <input
            className="admin-input"
            name="categoryName"
            list="category-options"
            value={categoryName}
            maxLength={80}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Unclassified"
          />
          <datalist id="category-options">
            {props.categories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
          {categoryName.trim() && !categoryExists && (
            <span className="text-xs text-amber-200">
              “{categoryName.trim()}” will be created as a top-level category.
            </span>
          )}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Date and time
          <input
            className="admin-input"
            type="datetime-local"
            name="time"
            required
            defaultValue={toLocalISOString(props.transaction?.time ?? new Date())}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Notes
          <textarea
            className="admin-input min-h-24 resize-y"
            name="comments"
            maxLength={500}
            defaultValue={props.transaction?.comments ?? ""}
          />
        </label>

        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <div className="flex flex-wrap justify-between gap-3 pt-2">
          <button type="button" className="admin-secondary-button" onClick={() => router.back()}>
            Cancel
          </button>
          <div className="flex gap-3">
            {!props.isNew && (
              <button type="button" className="admin-danger-button" onClick={onDelete} disabled={pending}>
                Delete
              </button>
            )}
            <button className="admin-primary-button" disabled={pending}>
              {pending ? "Saving…" : "Save transaction"}
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}
