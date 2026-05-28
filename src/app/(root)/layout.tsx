import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/shared/app-nav";
import { Footer } from "@/components/shared/footer";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <>
      <AppNav />
      <main className="flex-1 relative">
        <div className="absolute inset-0 -z-10 grid-bg opacity-20 pointer-events-none" />
        {children}
      </main>
      <Footer />
    </>
  );
}
