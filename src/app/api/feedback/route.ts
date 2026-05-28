import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Feedback } from "@/models/Feedback";
import { generateFeedback } from "@/lib/gemini";

const bodySchema = z.object({
  interviewId: z.string().refine(mongoose.Types.ObjectId.isValid, {
    message: "Invalid interview id",
  }),
  transcript: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();

    const interview = await Interview.findOne({
      _id: parsed.data.interviewId,
      userId: session.user.id,
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const ai = await generateFeedback({
      role: interview.role,
      level: interview.level,
      type: interview.type,
      transcript: parsed.data.transcript,
    });

    const feedback = await Feedback.findOneAndUpdate(
      { interviewId: parsed.data.interviewId, userId: session.user.id },
      {
        $set: {
          totalScore: Math.round(ai.totalScore),
          categoryScores: ai.categoryScores,
          strengths: ai.strengths,
          areasForImprovement: ai.areasForImprovement,
          finalAssessment: ai.finalAssessment,
        },
      },
      { upsert: true, new: true }
    );

    await Interview.updateOne(
      { _id: parsed.data.interviewId, userId: session.user.id },
      {
        $set: {
          finalized: true,
          questions: parsed.data.transcript.map((t) => ({
            question: t.question,
            answer: t.answer,
          })),
        },
      }
    );

    return NextResponse.json({ id: feedback._id.toString() }, { status: 201 });
  } catch (e) {
    console.error("[POST /api/feedback]", e);
    const message =
      e instanceof Error ? e.message : "Failed to generate feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
