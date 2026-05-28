import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInterviewById } from "@/lib/data";
import { InterviewRoom } from "@/components/interview/interview-room";

export const metadata = {
  title: "Interview in progress",
};

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id;

  const interview = await getInterviewById(id, userId);
  if (!interview) notFound();
  if (interview.finalized) redirect(`/interview/${id}/feedback`);

  return <InterviewRoom interview={interview} />;
}
