import Header1 from "@/components/Header1";
import PageContainer from "@/components/PageContainer";

export default function NewRoomPage() {
  return (
    <PageContainer className="grid grid-rows-[auto_1fr] h-screen">
      <Header1>Add New Room</Header1>

      <form className="space-y-4 mt-6 mx-5 grid grid-rows-[1fr_auto]">
        <div>
          <label htmlFor="roomLink">Room link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="roomLink"
              name="roomLink"
              placeholder="Enter room link"
              className="border border-gray-300 p-2 w-full rounded"
            />
            <button className="text-2xl">⬇️</button>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            type="reset"
            className="px-4 py-2 rounded border border-gray-300 min-w-24"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded min-w-24"
          >
            Save
          </button>
          <button
            type="button"
            className="border border-red-500 text-white px-4 py-2 rounded min-w-24"
          >
            Delete
          </button>
        </div>
      </form>
    </PageContainer>
  );
}
