"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Code2,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

import {
  createInterviewSchema,
  type CreateInterviewInput,
} from "@/lib/validations/interview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POPULAR_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Tailwind",
  "Docker",
  "AWS",
];

export function CreateInterviewForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [techInput, setTechInput] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<CreateInterviewInput>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      role: "",
      level: "mid",
      type: "mixed",
      techstack: [],
      amount: 5,
    },
    mode: "onChange",
  });

  const techstack = useWatch({ control: form.control, name: "techstack" });

  function addTech(tech: string) {
    const value = tech.trim();
    if (!value) return;
    if (techstack.includes(value)) return;
    if (techstack.length >= 10) {
      toast.error("Maximum 10 technologies");
      return;
    }
    form.setValue("techstack", [...techstack, value], { shouldValidate: true });
    setTechInput("");
  }

  function removeTech(tech: string) {
    form.setValue(
      "techstack",
      techstack.filter((t) => t !== tech),
      { shouldValidate: true }
    );
  }

  async function handleSubmit(values: CreateInterviewInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Interview ready! Loading questions...");
      router.push(`/interview/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setSubmitting(false);
    }
  }

  const totalSteps = 3;

  async function next() {
    if (step === 0) {
      const ok = await form.trigger("role");
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await form.trigger(["level", "type"]);
      if (!ok) return;
    }
    if (step === 2) {
      const ok = await form.trigger(["techstack", "amount"]);
      if (!ok) return;
      form.handleSubmit(handleSubmit)();
      return;
    }
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step
                ? "bg-gradient-to-r from-primary to-accent"
                : "bg-secondary"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-3">
          {step + 1} / {totalSteps}
        </span>
      </div>

      <div className="glass-strong rounded-2xl p-8 min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-3">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  What role are you preparing for?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Be specific. {`"Senior React Engineer"`} beats {`"Frontend Dev"`}.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Role title</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Frontend Engineer"
                  className="h-12 text-base"
                  {...form.register("role")}
                />
                {form.formState.errors.role && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Frontend Engineer",
                  "Backend Engineer",
                  "Full-stack Developer",
                  "Data Scientist",
                  "Product Manager",
                  "DevOps Engineer",
                ].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => form.setValue("role", r)}
                    className="px-3 py-1.5 rounded-full text-xs border border-border bg-card hover:bg-secondary transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-3">
                  <Layers className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Level & interview type
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We will calibrate the difficulty to match.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Experience level</Label>
                <LevelPicker form={form} />
              </div>

              <div className="space-y-1.5">
                <Label>Interview type</Label>
                <TypePicker form={form} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent mb-3">
                  <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Tech stack & question count
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add the technologies you want to be tested on.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="techstack">Tech stack</Label>
                <div className="flex gap-2">
                  <Input
                    id="techstack"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech(techInput);
                      }
                    }}
                    placeholder="Type a technology and press Enter"
                    className="h-12"
                  />
                  <Button
                    type="button"
                    onClick={() => addTech(techInput)}
                    variant="outline"
                    size="lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {techstack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {techstack.map((t) => (
                      <Badge key={t} variant="default" className="gap-1 pr-1">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
                          className="ml-0.5 rounded-full hover:bg-primary/30 p-0.5"
                          aria-label={`Remove ${t}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs text-muted-foreground">
                    Popular picks
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_STACK.filter((t) => !techstack.includes(t)).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => addTech(t)}
                          className="px-3 py-1 rounded-full text-xs border border-border bg-card hover:bg-secondary transition-colors"
                        >
                          + {t}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {form.formState.errors.techstack && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.techstack.message}
                  </p>
                )}
              </div>

              <AmountSlider form={form} />
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3</span>
                  <span>15</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 0 || submitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          variant="gradient"
          size="lg"
          onClick={next}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating questions...
            </>
          ) : step === totalSteps - 1 ? (
            <>
              <Sparkles className="h-4 w-4" />
              Generate interview
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function AmountSlider({
  form,
}: {
  form: UseFormReturn<CreateInterviewInput>;
}) {
  const value = useWatch({ control: form.control, name: "amount" });
  return (
    <div className="space-y-1.5">
      <Label>Number of questions: {value}</Label>
      <input
        type="range"
        min={3}
        max={15}
        step={1}
        value={value}
        onChange={(e) => form.setValue("amount", parseInt(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function LevelPicker({
  form,
}: {
  form: UseFormReturn<CreateInterviewInput>;
}) {
  const value = useWatch({ control: form.control, name: "level" });
  return (
    <Select
      value={value}
      onValueChange={(v) =>
        form.setValue("level", v as CreateInterviewInput["level"])
      }
    >
      <SelectTrigger className="h-12">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="junior">Junior — 0-2 years</SelectItem>
        <SelectItem value="mid">Mid — 2-5 years</SelectItem>
        <SelectItem value="senior">Senior — 5+ years</SelectItem>
      </SelectContent>
    </Select>
  );
}

function TypePicker({
  form,
}: {
  form: UseFormReturn<CreateInterviewInput>;
}) {
  const value = useWatch({ control: form.control, name: "type" });
  const options = [
    { v: "technical", label: "Technical" },
    { v: "behavioral", label: "Behavioral" },
    { v: "mixed", label: "Mixed" },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt.v}
          type="button"
          onClick={() => form.setValue("type", opt.v)}
          className={`h-12 rounded-lg border text-sm font-medium transition-all ${
            value === opt.v
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card hover:bg-secondary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
