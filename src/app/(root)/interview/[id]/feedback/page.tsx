import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/data";
import { FeedbackView } from "@/components/interview/feedback-view";

export const metadata = {
  title: "Feedback",
};

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id;

  const [interview, feedback] = await Promise.all([
    getInterviewById(id, userId),
    getFeedbackByInterviewId(id, userId),
  ]);

  if (!interview || !feedback) notFound();

  return <FeedbackView interview={interview} feedback={feedback} />;
}
