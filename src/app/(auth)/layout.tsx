import { LandingNav } from "@/components/shared/landing-nav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <main className="relative min-h-screen flex items-center justify-center pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 -z-20 grid-bg opacity-30" />
        {children}
      </main>
    </>
  );
}
