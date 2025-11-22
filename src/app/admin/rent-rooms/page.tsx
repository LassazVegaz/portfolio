import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";

export default function RentRoomsPage() {
  return (
    <PageContainer>
      <Header1>Rent Rooms</Header1>

      <Link
        className="inline-block text-center p-2 border border-gray-300 w-12 h-12 rounded-full text-2xl absolute bottom-8 right-8"
        href="/admin/rent-rooms/new"
      >
        +
      </Link>
    </PageContainer>
  );
}
