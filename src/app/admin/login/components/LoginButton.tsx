"use client";
import { useFormStatus } from "react-dom";

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded enabled:cursor-pointer disabled:opacity-50"
      disabled={pending}
    >
      Login
    </button>
  );
}
