import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { createInterviewSchema } from "@/lib/validations/interview";
import { generateInterviewQuestions } from "@/lib/gemini";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const interviews = await Interview.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      interviews: interviews.map((i) => ({
        ...i,
        _id: i._id.toString(),
        userId: i.userId.toString(),
      })),
    });
  } catch (e) {
    console.error("[GET /api/interviews]", e);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions({
      role: parsed.data.role,
      level: parsed.data.level,
      type: parsed.data.type,
      techstack: parsed.data.techstack,
      amount: parsed.data.amount,
    });

    await connectDB();
    const interview = await Interview.create({
      userId: session.user.id,
      role: parsed.data.role,
      level: parsed.data.level,
      type: parsed.data.type,
      techstack: parsed.data.techstack,
      questions: questions.map((q) => ({ question: q, answer: "" })),
      finalized: false,
    });

    return NextResponse.json(
      { id: interview._id.toString() },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/interviews]", e);
    const message =
      e instanceof Error ? e.message : "Failed to create interview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
