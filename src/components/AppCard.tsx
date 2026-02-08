import Link from "next/link";

export default function AppCard(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="bg-black border-2 border-white rounded p-1 w-32 h-32 flex items-center justify-center text-center md:text-lg font-semibold hover:bg-white hover:text-black transition-all duration-1000 odd:justify-self-end"
    />
  );
}
