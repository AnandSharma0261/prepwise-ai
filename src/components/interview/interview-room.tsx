"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2,
  KeyboardIcon,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useSpeechRecognition,
  useSpeechSynthesis,
} from "@/hooks/use-speech";
import type { InterviewDoc } from "@/types";

type Mode = "voice" | "text";

interface Props {
  interview: InterviewDoc;
}

export function InterviewRoom({ interview }: Props) {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("text");
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>(() =>
    interview.questions.map((q) => q.answer ?? "")
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [autoSpeak, setAutoSpeak] = React.useState(true);

  const speech = useSpeechRecognition();
  const tts = useSpeechSynthesis();

  const currentQuestion = interview.questions[currentIdx];
  const total = interview.questions.length;
  const progress = ((currentIdx + 1) / total) * 100;

  // While voice-listening, show live transcript; otherwise show saved answer.
  const currentAnswer = speech.isListening
    ? speech.transcript
    : answers[currentIdx] ?? "";

  // Speak the question whenever it changes
  React.useEffect(() => {
    if (!autoSpeak || !tts.isSupported) return;
    if (!currentQuestion?.question) return;
    const timer = setTimeout(() => {
      tts.speak(currentQuestion.question);
    }, 350);
    return () => {
      clearTimeout(timer);
      tts.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, autoSpeak]);

  function saveCurrentTranscript() {
    if (mode !== "voice" || !speech.transcript) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = speech.transcript;
      return next;
    });
  }

  function handleTextChange(value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = value;
      return next;
    });
  }

  async function toggleMic() {
    if (!speech.isSupported) {
      toast.error(
        speech.errorCode === "network"
          ? "Voice service unreachable. Switched to text mode."
          : "Voice not supported. Switched to text mode."
      );
      setMode("text");
      return;
    }
    if (speech.isListening) {
      speech.stop();
      saveCurrentTranscript();
      return;
    }
    speech.reset();
    speech.setTranscript(answers[currentIdx] ?? "");
    const loadingToast = toast.loading("Requesting microphone access...");
    await speech.start();
    toast.dismiss(loadingToast);

    // Inspect any error code the hook flagged during start().
    const code = speech.errorCode;
    if (code === "not-allowed") {
      toast.error(
        "Microphone blocked. Click the lock icon in the address bar and allow microphone access, then try again."
      );
    } else if (code === "audio-capture") {
      toast.error("No microphone found on this device.");
    } else if (code === "network") {
      toast.error("Voice service unreachable. Try text mode.");
    } else if (code === "start-failed" || code === "permission-failed") {
      toast.error("Couldn't start the mic. Try refreshing the page.");
    }
  }

  // If voice support drops mid-session (e.g. network error), render text mode
  // without mutating user-selected `mode`. The inline warning below explains it.
  const effectiveMode: Mode =
    mode === "voice" && !speech.isSupported ? "text" : mode;

  function gotoNext() {
    if (speech.isListening) speech.stop();
    saveCurrentTranscript();
    tts.cancel();
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
      speech.reset();
    }
  }

  function gotoPrev() {
    if (speech.isListening) speech.stop();
    saveCurrentTranscript();
    tts.cancel();
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      speech.reset();
    }
  }

  function jumpToQuestion(i: number) {
    if (speech.isListening) speech.stop();
    saveCurrentTranscript();
    tts.cancel();
    setCurrentIdx(i);
    speech.reset();
  }

  async function handleFinish() {
    if (speech.isListening) speech.stop();
    saveCurrentTranscript();
    const finalAnswers =
      mode === "voice" && speech.transcript
        ? answers.map((a, i) => (i === currentIdx ? speech.transcript : a))
        : answers;
    tts.cancel();

    const emptyCount = finalAnswers.filter((a) => !a.trim()).length;
    if (emptyCount > 0) {
      const ok = confirm(
        `You haven't answered ${emptyCount} question${emptyCount > 1 ? "s" : ""}. Submit anyway?`
      );
      if (!ok) return;
    }

    setSubmitting(true);
    try {
      const transcript = interview.questions.map((q, i) => ({
        question: q.question,
        answer: finalAnswers[i] ?? "",
      }));
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interview._id,
          transcript,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Feedback generated!");
      router.push(`/interview/${interview._id}/feedback`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit");
      setSubmitting(false);
    }
  }

  const wordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight capitalize">
            {interview.role}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="capitalize">
              {interview.level}
            </Badge>
            <Badge variant="accent" className="capitalize">
              {interview.type}
            </Badge>
            <Link
              href={`/interview/${interview._id}/manage`}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Edit questions
            </Link>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg glass">
          <button
            onClick={() => setMode("voice")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              effectiveMode === "voice"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="h-3.5 w-3.5 inline mr-1.5" />
            Voice
          </button>
          <button
            onClick={() => {
              setMode("text");
              if (speech.isListening) speech.stop();
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              effectiveMode === "text"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyboardIcon className="h-3.5 w-3.5 inline mr-1.5" />
            Text
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Question {currentIdx + 1} of {total}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* AI Interviewer Card */}
      <motion.div
        layout
        className="relative glass-strong rounded-3xl p-8 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-4">
          <div className="relative shrink-0">
            <div
              className={`h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 ${
                tts.isSpeaking ? "pulse-ring" : ""
              }`}
            >
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground font-medium">
                AI INTERVIEWER
              </div>
              <button
                onClick={() => {
                  if (tts.isSpeaking) tts.cancel();
                  else tts.speak(currentQuestion?.question ?? "");
                }}
                className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                aria-label="Replay question"
              >
                {tts.isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                {tts.isSpeaking ? "Stop" : "Replay"}
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-lg md:text-xl font-medium leading-relaxed"
              >
                {currentQuestion?.question}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Answer area */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Your answer</div>
          <div className="text-xs text-muted-foreground">
            {wordCount} word{wordCount !== 1 ? "s" : ""}
          </div>
        </div>

        {effectiveMode === "voice" ? (
          <div className="space-y-4">
            <div className="min-h-[140px] p-4 rounded-xl bg-background/50 border border-border text-sm leading-relaxed">
              {currentAnswer || speech.interimTranscript ? (
                <>
                  <span>{currentAnswer}</span>
                  <span className="text-muted-foreground">
                    {speech.interimTranscript &&
                      ` ${speech.interimTranscript}`}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Press the mic and start speaking. Your transcript will appear
                  here.
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                size="lg"
                variant={speech.isListening ? "destructive" : "gradient"}
                onClick={toggleMic}
                className={`rounded-full px-6 ${speech.isListening ? "pulse-ring" : ""}`}
              >
                {speech.isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    {currentAnswer ? "Continue speaking" : "Start speaking"}
                  </>
                )}
              </Button>
              {currentAnswer && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[currentIdx] = "";
                      return next;
                    });
                    speech.reset();
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
            {!speech.isSupported && (
              <p className="text-xs text-warning text-center">
                {speech.errorCode === "network"
                  ? "Voice recognition service unreachable from this browser. Please switch to text mode."
                  : "Voice recognition not supported in this browser. Please switch to text mode."}
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full p-4 rounded-xl bg-background/50 border border-border text-sm leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring scrollbar-thin"
          />
        )}

        <div className="flex items-center gap-2 pt-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="accent-primary"
            />
            Auto-read questions aloud
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={gotoPrev}
          disabled={currentIdx === 0 || submitting}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {interview.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpToQuestion(i)}
              aria-label={`Go to question ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === currentIdx
                  ? "w-6 bg-primary"
                  : answers[i]
                    ? "w-2 bg-success"
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {currentIdx === total - 1 ? (
          <Button
            variant="gradient"
            onClick={handleFinish}
            disabled={submitting}
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Submit & get feedback
              </>
            )}
          </Button>
        ) : (
          <Button variant="gradient" onClick={gotoNext} disabled={submitting}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
