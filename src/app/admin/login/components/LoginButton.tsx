"use client";
import { useFormStatus } from "react-dom";
import PrimaryButton from "@/components/PrimaryButton";

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <PrimaryButton
      type="submit"
      className="enabled:cursor-pointer"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </PrimaryButton>
  );
}
