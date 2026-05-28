export type InterviewLevel = "junior" | "mid" | "senior";
export type InterviewType = "technical" | "behavioral" | "mixed";

export interface InterviewQuestion {
  question: string;
  answer?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

export interface FeedbackData {
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
}

export interface InterviewDoc {
  _id: string;
  userId: string;
  role: string;
  level: InterviewLevel;
  type: InterviewType;
  techstack: string[];
  questions: InterviewQuestion[];
  finalized: boolean;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackDoc {
  _id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}
