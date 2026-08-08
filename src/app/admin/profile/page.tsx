import TopNavigator from "@/components/HomeButton";
import PageContainer from "@/components/PageContainer";
import authService from "@/services/auth-service";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user = await authService.getAuthenticatedUser();
  if (!user) redirect("/admin/login");

  return (
    <main className="admin-shell min-h-screen">
      <PageContainer className="mx-auto max-w-3xl">
        <TopNavigator />
        <p className="admin-eyebrow mt-10">Account security</p>
        <h1 className="mt-2 text-3xl font-semibold">Admin profile</h1>
        <p className="mt-3 text-sm text-slate-400">
          Changing your password invalidates previous sessions.
        </p>
        <ProfileForm username={user.username} />
      </PageContainer>
    </main>
  );
}
