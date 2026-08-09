"use client";

import { useActionState } from "react";
import { updateProfileAction } from "./actions";

export default function ProfileForm({
  username,
}: Readonly<{ username: string }>) {
  const [state, action, pending] = useActionState(updateProfileAction, {});

  return (
    <form
      action={action}
      className="admin-panel mt-8 grid gap-5 rounded-2xl p-6"
    >
      <label className="grid gap-2 text-sm font-medium">
        Username
        <input
          className="admin-input"
          name="username"
          defaultValue={username}
          required
          minLength={3}
          maxLength={80}
          autoComplete="username"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Current password
        <input
          className="admin-input"
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          New password
          <input
            className="admin-input"
            type="password"
            name="newPassword"
            minLength={12}
            autoComplete="new-password"
            placeholder="Leave blank to keep it"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Confirm new password
          <input
            className="admin-input"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
          />
        </label>
      </div>
      {state.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-300">{state.success}</p>
      )}
      <button
        type="submit"
        className="admin-primary-button justify-self-start"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
