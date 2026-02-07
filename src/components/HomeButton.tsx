import Image from "next/image";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Link
      href="/admin"
      className="link mb-4 inline-block absolute top-0 left-0 p-1.5 rounded-br-md border-r border-b"
    >
      <Image src="/home.png" width={24} height={24} alt="home" />
    </Link>
  );
}
