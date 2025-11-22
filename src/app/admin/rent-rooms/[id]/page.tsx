import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default function NewRoomPage() {
  return (
    <PageContainer className="grid grid-rows-[auto_1fr] h-screen">
      <Header1>Add New Room</Header1>

      <form className="space-y-4 mt-6 mx-5 grid grid-rows-[1fr_auto]">
        <div>
          <label htmlFor="roomLink">Room link</label>
          <input
            type="text"
            id="roomLink"
            name="roomLink"
            placeholder="Enter room link"
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded min-w-24"
          >
            Save
          </button>
        </div>
      </form>
    </PageContainer>
  );
}
