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

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type FinalizeInterviewInput = z.infer<typeof finalizeInterviewSchema>;
