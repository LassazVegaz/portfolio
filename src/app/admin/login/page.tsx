import PageContainer from "@/components/PageContainer";
import Header1 from "@/components/Header1";
import { loginAction } from "./actions";
import LoginButton from "./components/LoginButton";
import routingService from "@/services/routing-service";

export default async function LoginPage() {
  await routingService.authorizedRedirection();

  return (
    <PageContainer className="grid grid-rows-[auto_1fr] items-center h-screen">
      <Header1>Access Admin Part</Header1>

      <form
        className="flex flex-col gap-4 max-w-sm mx-auto w-full"
        action={loginAction}
      >
        <p className="text-gray-600 text-center">
          This is a protected admin page. Only authorized users can access this
          section.
        </p>

        <input
          type="text"
          name="username"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <LoginButton />
      </form>
    </PageContainer>
  );
}
