"use client";

import { useActionState } from "react";
import { updateOpeningBalanceAction } from "./actions";

export default function BalanceForm({ openingBalanceCents }: { openingBalanceCents: number }) {
  const [state, action, pending] = useActionState(updateOpeningBalanceAction, {});
  return (
    <form action={action} className="admin-panel mt-8 grid gap-5 rounded-2xl p-6">
      <label className="grid gap-2 text-sm font-medium">
        Opening balance (SGD)
        <input
          className="admin-input"
          name="openingBalance"
          inputMode="decimal"
          defaultValue={(openingBalanceCents / 100).toFixed(2)}
          required
        />
      </label>
      <p className="text-sm leading-6 text-slate-400">
        This is the account balance immediately before your first recorded transaction. It may be negative.
      </p>
      {state.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-300">{state.success}</p>}
      <button className="admin-primary-button justify-self-start" disabled={pending}>
        {pending ? "Saving…" : "Save opening balance"}
      </button>
    </form>
  );
}
