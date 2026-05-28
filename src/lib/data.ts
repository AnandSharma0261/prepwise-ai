import "server-only";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models/Interview";
import { Feedback } from "@/models/Feedback";
import type { InterviewDoc, FeedbackDoc } from "@/types";

export async function getUserInterviews(userId: string): Promise<InterviewDoc[]> {
  try {
    await connectDB();
    const docs = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((d) => ({
      _id: d._id.toString(),
      userId: d.userId.toString(),
      role: d.role,
      level: d.level,
      type: d.type,
      techstack: d.techstack ?? [],
      questions: d.questions ?? [],
      finalized: d.finalized,
      coverImage: d.coverImage ?? "",
      createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: d.updatedAt?.toISOString() ?? new Date().toISOString(),
    }));
  } catch (e) {
    console.error("[data] getUserInterviews failed:", e);
    return [];
  }
}

export async function getInterviewById(
  id: string,
  userId: string
): Promise<InterviewDoc | null> {
  try {
    await connectDB();
    const d = await Interview.findOne({ _id: id, userId }).lean();
    if (!d) return null;
    return {
      _id: d._id.toString(),
      userId: d.userId.toString(),
      role: d.role,
      level: d.level,
      type: d.type,
      techstack: d.techstack ?? [],
      questions: d.questions ?? [],
      finalized: d.finalized,
      coverImage: d.coverImage ?? "",
      createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: d.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  } catch (e) {
    console.error("[data] getInterviewById failed:", e);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  interviewId: string,
  userId: string
): Promise<FeedbackDoc | null> {
  try {
    await connectDB();
    const d = await Feedback.findOne({ interviewId, userId }).lean();
    if (!d) return null;
    return {
      _id: d._id.toString(),
      interviewId: d.interviewId.toString(),
      userId: d.userId.toString(),
      totalScore: d.totalScore,
      categoryScores: d.categoryScores ?? [],
      strengths: d.strengths ?? [],
      areasForImprovement: d.areasForImprovement ?? [],
      finalAssessment: d.finalAssessment ?? "",
      createdAt: d.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  } catch (e) {
    console.error("[data] getFeedbackByInterviewId failed:", e);
    return null;
  }
}

export async function getUserStats(userId: string) {
  try {
    await connectDB();
    const [total, finalized, feedbacks] = await Promise.all([
      Interview.countDocuments({ userId }),
      Interview.countDocuments({ userId, finalized: true }),
      Feedback.find({ userId }).select("totalScore createdAt").lean(),
    ]);

    const avgScore =
      feedbacks.length > 0
        ? Math.round(
            feedbacks.reduce((sum, f) => sum + (f.totalScore ?? 0), 0) /
              feedbacks.length
          )
        : 0;

    const bestScore =
      feedbacks.length > 0
        ? Math.max(...feedbacks.map((f) => f.totalScore ?? 0))
        : 0;

    return {
      total,
      finalized,
      avgScore,
      bestScore,
      scoreHistory: feedbacks
        .map((f) => ({
          score: f.totalScore,
          date: f.createdAt?.toISOString() ?? new Date().toISOString(),
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    };
  } catch (e) {
    console.error("[data] getUserStats failed:", e);
    return {
      total: 0,
      finalized: 0,
      avgScore: 0,
      bestScore: 0,
      scoreHistory: [],
    };
  }
}
