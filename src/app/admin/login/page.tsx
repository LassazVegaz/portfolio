"use client";

import PageContainer from "@/components/PageContainer";
import { useActionState } from "react";
import { loginAction } from "./actions";
import LoginButton from "./components/LoginButton";

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, {});

  return (
    <main className="admin-shell min-h-screen grid place-items-center px-5 py-10">
      <PageContainer className="admin-panel w-full max-w-md rounded-3xl p-7 sm:p-10">
        <p className="admin-eyebrow">Private workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Sign in to access your financial dashboard and admin tools.
        </p>

        <form className="mt-8 grid gap-5" action={action}>
          <label className="grid gap-2 text-sm font-medium">
            Username
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              maxLength={80}
              className="admin-input"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              maxLength={200}
              className="admin-input"
            />
          </label>

          {state.error && (
            <p role="alert" className="text-sm text-rose-300">
              {state.error}
            </p>
          )}
          <LoginButton />
        </form>
      </PageContainer>
    </main>
  );
}
