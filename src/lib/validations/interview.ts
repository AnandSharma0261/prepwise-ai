import { z } from "zod";

export const createInterviewSchema = z.object({
  role: z.string().min(2, "Role is required").max(60),
  level: z.enum(["junior", "mid", "senior"]),
  type: z.enum(["technical", "behavioral", "mixed"]),
  techstack: z
    .array(z.string().min(1).max(30))
    .min(1, "Add at least one technology")
    .max(10),
  amount: z.number().int().min(3).max(15),
});

export const updateAnswerSchema = z.object({
  questionIndex: z.number().int().min(0),
  answer: z.string().max(5000),
});

export const finalizeInterviewSchema = z.object({
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

// --- Question CRUD (used by Server Actions) ---
// ObjectId validated via regex here so this file stays client-safe
// (it's imported by client components) and never pulls in mongoose.
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid interview id");

export const addQuestionSchema = z.object({
  interviewId: objectId,
  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question is too long"),
});

export const editQuestionSchema = z.object({
  interviewId: objectId,
  index: z.number().int().min(0),
  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question is too long"),
});

export const deleteQuestionSchema = z.object({
  interviewId: objectId,
  index: z.number().int().min(0),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type FinalizeInterviewInput = z.infer<typeof finalizeInterviewSchema>;
export type AddQuestionInput = z.infer<typeof addQuestionSchema>;
export type EditQuestionInput = z.infer<typeof editQuestionSchema>;
