"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { getScoreBand, getScoreColor } from "@/lib/utils";
import type { FeedbackDoc, InterviewDoc } from "@/types";

interface Props {
  interview: InterviewDoc;
  feedback: FeedbackDoc;
}

export function FeedbackView({ interview, feedback }: Props) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative glass-strong rounded-3xl p-8 md:p-12 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <ScoreRing score={feedback.totalScore} size={220} />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Interview Feedback
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize mb-2">
              {interview.role}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default" className="capitalize">
                {interview.level}
              </Badge>
              <Badge variant="accent" className="capitalize">
                {interview.type}
              </Badge>
              <Badge
                variant="outline"
                style={{
                  color: getScoreColor(feedback.totalScore),
                  borderColor: getScoreColor(feedback.totalScore),
                }}
              >
                {getScoreBand(feedback.totalScore)}
              </Badge>
            </div>
            <p className="text-foreground/90 leading-relaxed">
              {feedback.finalAssessment}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Category Scores */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Category breakdown
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {feedback.categoryScores.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{cat.name}</h3>
                <div
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: getScoreColor(cat.score) }}
                >
                  {cat.score}
                  <span className="text-sm text-muted-foreground font-normal">
                    /100
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.score}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${getScoreColor(cat.score)}, ${getScoreColor(cat.score)}cc)`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cat.comment}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Strengths & Improvements */}
      <section className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Your strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Areas to improve</h3>
          </div>
          <ul className="space-y-2.5">
            {feedback.areasForImprovement.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/15 text-warning text-xs font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Transcript */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Your answers</h2>
        <div className="space-y-3">
          {interview.questions.map((q, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="glass rounded-2xl p-5 group"
            >
              <summary className="cursor-pointer list-none flex items-start gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">
                  Q{i + 1}
                </span>
                <span className="font-medium flex-1">{q.question}</span>
              </summary>
              <div className="mt-3 pl-10 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {q.answer || "(No answer provided)"}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button asChild variant="gradient" size="lg">
          <Link href="/interview/create">
            <RefreshCw className="h-4 w-4" />
            Practice another interview
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </section>
    </div>
  );
}
