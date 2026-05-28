import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { getUserInterviews, getUserStats } from "@/lib/data";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ScoreChart } from "@/components/dashboard/score-chart";
import { InterviewCard } from "@/components/dashboard/interview-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [interviews, stats] = await Promise.all([
    getUserInterviews(userId),
    getUserStats(userId),
  ]);

  const firstName = session!.user!.name?.split(" ")[0] ?? "there";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* Hero / Welcome */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-primary/15 via-card to-accent/15 border border-border/60">
        <div className="absolute inset-0 grid-bg opacity-20 -z-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Welcome back,
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Ready to crush your next interview? Pick up where you left off or
              start a new practice session.
            </p>
          </div>
          <Button asChild size="lg" variant="gradient">
            <Link href="/interview/create">
              <Plus className="h-5 w-5" />
              Start new interview
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Your stats</h2>
        <StatsCards
          total={stats.total}
          finalized={stats.finalized}
          avgScore={stats.avgScore}
          bestScore={stats.bestScore}
        />
      </section>

      {/* Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Progress over time
          </h2>
          <span className="text-xs text-muted-foreground">
            Last {stats.scoreHistory.length} completed interviews
          </span>
        </div>
        <div className="glass rounded-2xl p-6">
          <ScoreChart data={stats.scoreHistory} />
        </div>
      </section>

      {/* Interviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Your interviews
          </h2>
          <span className="text-xs text-muted-foreground">
            {interviews.length} total
          </span>
        </div>

        {interviews.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-4">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No interviews yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Start your first AI-powered mock interview and we will generate
              personalized questions for you in seconds.
            </p>
            <Button asChild variant="gradient" size="lg">
              <Link href="/interview/create">
                <Plus className="h-5 w-5" />
                Create your first interview
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((interview, i) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
