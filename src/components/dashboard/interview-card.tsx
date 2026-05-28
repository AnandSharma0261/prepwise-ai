"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils";
import type { InterviewDoc } from "@/types";

interface Props {
  interview: InterviewDoc;
  index?: number;
}

export function InterviewCard({ interview, index = 0 }: Props) {
  const router = useRouter();

  const href = interview.finalized
    ? `/interview/${interview._id}/feedback`
    : `/interview/${interview._id}`;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this interview and its feedback?")) return;

    try {
      const res = await fetch(`/api/interviews/${interview._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Interview deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <Link
        href={href}
        className="group block glass rounded-2xl p-5 hover:bg-card/90 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-lg shadow-md">
              {interview.role.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold capitalize line-clamp-1">
                {interview.role}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatRelative(interview.createdAt)}
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            aria-label="Delete interview"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-destructive/15 hover:text-destructive text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="default" className="capitalize">
            {interview.level}
          </Badge>
          <Badge variant="accent" className="capitalize">
            {interview.type}
          </Badge>
          {interview.techstack.slice(0, 2).map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
          {interview.techstack.length > 2 && (
            <Badge variant="outline">
              +{interview.techstack.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          {interview.finalized ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-warning">
              <Clock className="h-4 w-4" />
              In progress
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {interview.questions.length} questions
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {interview.finalized ? "View feedback" : "Continue"}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
