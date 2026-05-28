"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { score: number; date: string }[];
}

export function ScoreChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
        Complete an interview to see your progress.
      </div>
    );
  }

  const formatted = data.map((d, i) => ({
    name: `#${i + 1}`,
    score: d.score,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(263 90% 66%)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(263 90% 66%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          domain={[0, 100]}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
          }}
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.date ?? label
          }
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(263 90% 66%)"
          strokeWidth={2.5}
          fill="url(#scoreGradient)"
          dot={{ r: 4, fill: "hsl(263 90% 66%)" }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
