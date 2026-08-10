"use client";

import Form from "@/components/Form";
import { useRouter } from "next/navigation";
import { SubmitEventHandler, useState } from "react";
import { createAction, deleteAction, updateAction } from "./actions";

type Instrument = {
  id: string;
  name: string;
  isCreditCard: boolean;
  transactionCount: number;
};

export default function ClientForm({
  instrument,
}: Readonly<{ instrument?: Instrument | null }>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    const input = {
      name: String((data.get("name") as string) ?? ""),
      isCreditCard: data.get("isCreditCard") === "on",
    };
    try {
      if (instrument) {
        await updateAction(instrument.id, input);
        router.refresh();
      } else {
        router.push(`/admin/money/instruments/${await createAction(input)}`);
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save instrument.",
      );
    } finally {
      setPending(false);
    }
  };

  const onDelete = async () => {
    if (!instrument || !confirm(`Delete ${instrument.name}?`)) return;
    setPending(true);
    setError(undefined);
    try {
      await deleteAction(instrument.id);
      router.push("/admin/money/instruments");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete instrument.",
      );
      setPending(false);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="admin-panel mt-page grid gap-5 rounded-admin p-page"
    >
      <label className="grid gap-2 text-sm font-medium">
        Name
        <input
          className="admin-input"
          name="name"
          maxLength={80}
          defaultValue={instrument?.name}
          placeholder="Cash, DBS yuu, PayNow…"
          required
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          name="isCreditCard"
          defaultChecked={instrument?.isCreditCard}
          className="size-4 accent-admin-accent"
        />
        This instrument is a credit card
      </label>
      <p className="text-sm leading-6 text-admin-muted">
        Instruments share the primary money balance. Credit-card bill payments
        are deliberately not recorded as separate transactions.
      </p>
      {instrument && (
        <p className="text-xs text-admin-muted">
          Used by {instrument.transactionCount} transaction
          {instrument.transactionCount === 1 ? "" : "s"}.
        </p>
      )}
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <div className="flex gap-3">
          {instrument && (
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
            {pending ? "Saving…" : "Save instrument"}
          </button>
        </div>
      </div>
    </Form>
  );
}
