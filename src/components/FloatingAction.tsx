import Link from "next/link";

export default function FloatingAction(
  props: React.ComponentProps<typeof Link>,
) {
  return (
    <Link
      {...props}
      className="fixed bottom-6 right-6 z-20 inline-grid h-14 w-14 place-items-center rounded-full bg-emerald-300 text-2xl font-medium text-slate-950 shadow-xl shadow-emerald-950/40 transition hover:scale-105"
    />
  );
}
