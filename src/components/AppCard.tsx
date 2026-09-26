import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function AppCard({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={twMerge(
        `admin-panel flex h-32 w-45 items-center justify-center rounded-2xl border border-white/10 text-center font-semibold transition hover:-translate-y-1 hover:border-emerald-300/40 hover:text-emerald-300`,
        className,
      )}
    />
  );
}
