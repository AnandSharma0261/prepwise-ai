"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models/Interview";
import {
  addQuestionSchema,
  editQuestionSchema,
  deleteQuestionSchema,
} from "@/lib/validations/interview";

/**
 * Server Actions implementing CRUD over an interview's questions.
 *
 * Design notes:
 * - Every action authenticates via auth() and scopes the query by the
 *   session user id, so a user can never mutate another user's interview.
 * - A finalized interview (feedback already generated) is locked — its
 *   questions can't be changed, to keep past feedback consistent with the
 *   transcript it was based on.
 * - We load → mutate in JS → save, rather than positional $set/$pull,
 *   because the question subdocuments use { _id: false } which makes
 *   index-based positional operators awkward. Load-modify-save is clearer
 *   and the documents are tiny (max 15 questions).
 * - revalidatePath refreshes the SSR pages that read this data.
 */

type ActionResult =
  | { success: true; questions: string[] }
  | { success: false; error: string };

type LoadResult =
  | { ok: false; error: string }
  | { ok: true; interview: InstanceType<typeof Interview> };

async function loadOwned(interviewId: string): Promise<LoadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in." };
  }
  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    return { ok: false, error: "Invalid interview id." };
  }

  await connectDB();
  const interview = await Interview.findOne({
    _id: interviewId,
    userId: session.user.id,
  });

  if (!interview) return { ok: false, error: "Interview not found." };
  if (interview.finalized) {
    return {
      ok: false,
      error: "This interview is already completed and can't be edited.",
    };
  }
  return { ok: true, interview };
}

function questionStrings(interview: {
  questions: { question: string }[];
}): string[] {
  return interview.questions.map((q) => q.question);
}

function revalidate(interviewId: string) {
  revalidatePath(`/interview/${interviewId}/manage`);
  revalidatePath(`/interview/${interviewId}`);
  revalidatePath("/dashboard");
}

/** CREATE — append a new question to the interview. */
export async function addQuestion(input: {
  interviewId: string;
  question: string;
}): Promise<ActionResult> {
  const parsed = addQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const owned = await loadOwned(parsed.data.interviewId);
  if (!owned.ok) return { success: false, error: owned.error };

  const { interview } = owned;
  if (interview.questions.length >= 20) {
    return { success: false, error: "An interview can have at most 20 questions." };
  }

  interview.questions.push({ question: parsed.data.question, answer: "" });
  await interview.save();
  revalidate(parsed.data.interviewId);

  return { success: true, questions: questionStrings(interview) };
}

/** UPDATE — edit the text of the question at `index`. */
export async function editQuestion(input: {
  interviewId: string;
  index: number;
  question: string;
}): Promise<ActionResult> {
  const parsed = editQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const owned = await loadOwned(parsed.data.interviewId);
  if (!owned.ok) return { success: false, error: owned.error };

  const { interview } = owned;
  if (parsed.data.index >= interview.questions.length) {
    return { success: false, error: "That question no longer exists." };
  }

  interview.questions[parsed.data.index].question = parsed.data.question;
  await interview.save();
  revalidate(parsed.data.interviewId);

  return { success: true, questions: questionStrings(interview) };
}

/** DELETE — remove the question at `index`. */
export async function deleteQuestion(input: {
  interviewId: string;
  index: number;
}): Promise<ActionResult> {
  const parsed = deleteQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const owned = await loadOwned(parsed.data.interviewId);
  if (!owned.ok) return { success: false, error: owned.error };

  const { interview } = owned;
  if (parsed.data.index >= interview.questions.length) {
    return { success: false, error: "That question no longer exists." };
  }
  if (interview.questions.length <= 1) {
    return { success: false, error: "An interview needs at least one question." };
  }

  interview.questions.splice(parsed.data.index, 1);
  await interview.save();
  revalidate(parsed.data.interviewId);

  return { success: true, questions: questionStrings(interview) };
}
