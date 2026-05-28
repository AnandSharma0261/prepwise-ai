import { CreateInterviewForm } from "@/components/interview/create-form";

export const metadata = {
  title: "Create interview",
};

export default function CreateInterviewPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Set up your <span className="text-gradient">mock interview</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Three quick steps. Then our AI will generate personalized questions
          just for you.
        </p>
      </div>
      <CreateInterviewForm />
    </div>
  );
}
