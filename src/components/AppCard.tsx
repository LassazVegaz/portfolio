import Link from "next/link";

export default function AppCard(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="admin-panel flex min-h-32 items-center justify-center rounded-2xl border border-white/10 p-5 text-center font-semibold transition hover:-translate-y-1 hover:border-emerald-300/40 hover:text-emerald-300"
    />
  );
}
