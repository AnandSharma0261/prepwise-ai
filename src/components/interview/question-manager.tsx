"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Loader2,
  Pencil,
  Plus,
  Play,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "@/lib/actions/interview";
import type { InterviewDoc } from "@/types";

interface Props {
  interview: InterviewDoc;
}

export function QuestionManager({ interview }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = React.useState<string[]>(
    interview.questions.map((q) => q.question)
  );
  const [newQuestion, setNewQuestion] = React.useState("");
  const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function handleAdd() {
    const value = newQuestion.trim();
    if (value.length < 5) {
      toast.error("Question must be at least 5 characters");
      return;
    }
    setPending(true);
    const res = await addQuestion({ interviewId: interview._id, question: value });
    setPending(false);
    if (!res.success) return toast.error(res.error);
    setQuestions(res.questions);
    setNewQuestion("");
    toast.success("Question added");
  }

  function startEdit(idx: number) {
    setEditingIdx(idx);
    setEditingText(questions[idx]);
  }

  async function handleSaveEdit(idx: number) {
    const value = editingText.trim();
    if (value.length < 5) {
      toast.error("Question must be at least 5 characters");
      return;
    }
    setPending(true);
    const res = await editQuestion({
      interviewId: interview._id,
      index: idx,
      question: value,
    });
    setPending(false);
    if (!res.success) return toast.error(res.error);
    setQuestions(res.questions);
    setEditingIdx(null);
    toast.success("Question updated");
  }

  async function handleDelete(idx: number) {
    if (!confirm("Delete this question?")) return;
    setPending(true);
    const res = await deleteQuestion({ interviewId: interview._id, index: idx });
    setPending(false);
    if (!res.success) return toast.error(res.error);
    setQuestions(res.questions);
    toast.success("Question deleted");
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-bold tracking-tight capitalize">
            Manage questions — {interview.role}
          </h1>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="capitalize">
              {interview.level}
            </Badge>
            <Badge variant="accent" className="capitalize">
              {interview.type}
            </Badge>
            <Badge variant="outline">{questions.length} questions</Badge>
          </div>
        </div>
        <Button
          variant="gradient"
          onClick={() => router.push(`/interview/${interview._id}`)}
        >
          <Play className="h-4 w-4" />
          Start interview
        </Button>
      </div>

      {/* Add new question */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <div className="text-sm font-medium">Add a question</div>
        <div className="flex gap-2">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="e.g. How would you design a rate limiter?"
            disabled={pending}
          />
          <Button onClick={handleAdd} disabled={pending} variant="default">
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </Button>
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {questions.map((q, idx) => (
            <motion.div
              key={`${idx}-${q.slice(0, 12)}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="glass rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                {idx + 1}
              </div>

              {editingIdx === idx ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(idx);
                      if (e.key === "Escape") setEditingIdx(null);
                    }}
                    autoFocus
                    disabled={pending}
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => handleSaveEdit(idx)}
                      disabled={pending}
                      aria-label="Save"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingIdx(null)}
                      disabled={pending}
                      aria-label="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-sm leading-relaxed pt-1">{q}</p>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit(idx)}
                      disabled={pending}
                      aria-label="Edit question"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(idx)}
                      disabled={pending}
                      aria-label="Delete question"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No questions yet. Add one above to get started.
          </p>
        )}
      </div>
    </div>
  );
}
