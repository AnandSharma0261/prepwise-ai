import { auth } from "@/auth";
import { getUserStats } from "@/lib/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getInitials } from "@/lib/utils";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user!;
  const stats = await getUserStats(user.id);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8">
      <section className="glass-strong rounded-3xl p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-primary/30">
            {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
            <AvatarFallback className="text-3xl">
              {getInitials(user.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">{user.email}</p>
            <div className="mt-3 flex gap-2">
              <Badge variant="default">
                {stats.total} interview{stats.total !== 1 ? "s" : ""}
              </Badge>
              {stats.avgScore > 0 && (
                <Badge variant="accent">
                  Avg score: {stats.avgScore}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Your stats
        </h2>
        <StatsCards
          total={stats.total}
          finalized={stats.finalized}
          avgScore={stats.avgScore}
          bestScore={stats.bestScore}
        />
      </section>
    </div>
  );
}
