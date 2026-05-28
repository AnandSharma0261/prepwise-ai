"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Sparkles, Activity } from "lucide-react";

interface Props {
  total: number;
  finalized: number;
  avgScore: number;
  bestScore: number;
}

export function StatsCards({ total, finalized, avgScore, bestScore }: Props) {
  const stats = [
    {
      label: "Interviews taken",
      value: total,
      icon: Activity,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Completed",
      value: finalized,
      icon: Target,
      color: "from-cyan-500 to-blue-600",
    },
    {
      label: "Average score",
      value: avgScore > 0 ? `${avgScore}` : "—",
      suffix: avgScore > 0 ? "/100" : "",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Best score",
      value: bestScore > 0 ? `${bestScore}` : "—",
      suffix: bestScore > 0 ? "/100" : "",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="glass rounded-2xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform"
        >
          <div
            className={`absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}
          />
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-md mb-3`}
          >
            <s.icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-2xl font-bold tracking-tight">
            {s.value}
            {s.suffix && (
              <span className="text-sm text-muted-foreground font-normal">
                {s.suffix}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
