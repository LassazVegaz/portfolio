import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";

export default function LoginPage() {
  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Access Admin Part</Header1>

      <form className="flex flex-col gap-4 max-w-sm mx-auto w-full">
        <p className="text-gray-600 text-center">
          This is a protected admin page. Only authorized users can access this
          section.
        </p>

        <input type="email" className="p-2 border border-gray-300 rounded" />
        <input type="password" className="p-2 border border-gray-300 rounded" />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded cursor-pointer"
        >
          Login
        </button>
      </form>
    </PageContainer>
  );
}
