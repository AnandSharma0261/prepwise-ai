import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Feedback } from "@/models/Feedback";
import { z } from "zod";

const updateSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string().max(5000).default(""),
      })
    )
    .optional(),
  finalized: z.boolean().optional(),
});

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const interview = await Interview.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();
    if (!interview) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      interview: {
        ...interview,
        _id: interview._id.toString(),
        userId: interview.userId.toString(),
      },
    });
  } catch (e) {
    console.error("[GET /api/interviews/[id]]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Interview.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: parsed.data },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      interview: {
        ...updated,
        _id: updated._id.toString(),
        userId: updated.userId.toString(),
      },
    });
  } catch (e) {
    console.error("[PATCH /api/interviews/[id]]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const deleted = await Interview.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await Feedback.deleteMany({ interviewId: id });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[DELETE /api/interviews/[id]]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
