"use client";

import { useActionState } from "react";
import { updateDefaultInstrumentAction } from "./actions";

export default function DefaultInstrumentForm({
  instruments,
  defaultInstrumentId,
}: Readonly<{
  instruments: { id: string; name: string; isCreditCard: boolean }[];
  defaultInstrumentId: string;
}>) {
  const [state, action, pending] = useActionState(
    updateDefaultInstrumentAction,
    {},
  );
  return (
    <form action={action} className="admin-panel grid gap-5 rounded-admin p-page">
      <div>
        <h2 className="font-semibold">Default instrument</h2>
        <p className="mt-1 text-sm text-admin-muted">
          New transactions select this source or destination automatically.
        </p>
      </div>
      <select
        className="admin-input"
        name="defaultInstrumentId"
        defaultValue={defaultInstrumentId}
      >
        {instruments.map((instrument) => (
          <option key={instrument.id} value={instrument.id}>
            {instrument.name}{instrument.isCreditCard ? " · credit card" : ""}
          </option>
        ))}
      </select>
      {state.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-300">{state.success}</p>}
      <button type="submit" className="admin-primary-button justify-self-start" disabled={pending}>
        {pending ? "Saving…" : "Save default instrument"}
      </button>
    </form>
  );
}
