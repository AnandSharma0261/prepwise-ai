import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInterviewById } from "@/lib/data";
import { QuestionManager } from "@/components/interview/question-manager";

export const metadata = {
  title: "Manage questions",
};

export default async function ManageQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id;

  const interview = await getInterviewById(id, userId);
  if (!interview) notFound();
  // A finalized interview is locked; send the user to its feedback instead.
  if (interview.finalized) redirect(`/interview/${id}/feedback`);

  return <QuestionManager interview={interview} />;
}
