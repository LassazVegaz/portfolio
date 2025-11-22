import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";
import Link from "next/link";

const rooms = [
  "Room in Sembawang for $1200/month",
  "Room in Bedok for $1000/month",
  "Room in Jurong for $1100/month",
];

export default function RentRoomsPage() {
  return (
    <PageContainer>
      <Header1>Rent Rooms</Header1>

      <div className="space-y-4 px-5 mt-4">
        {rooms.map((r) => (
          <div key={r} className="p-4 border border-gray-300 rounded">
            {r}
          </div>
        ))}
      </div>

      <Link
        className="inline-block text-center p-2 border border-gray-300 w-12 h-12 rounded-full text-2xl absolute bottom-8 right-8"
        href="/admin/rent-rooms/new"
      >
        +
      </Link>
    </PageContainer>
  );
}
