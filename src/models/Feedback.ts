import { Schema, models, model } from "mongoose";

const CategoryScoreSchema = new Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    comment: { type: String, default: "" },
  },
  { _id: false }
);

const FeedbackSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalScore: { type: Number, min: 0, max: 100, required: true },
    categoryScores: { type: [CategoryScoreSchema], default: [] },
    strengths: { type: [String], default: [] },
    areasForImprovement: { type: [String], default: [] },
    finalAssessment: { type: String, default: "" },
  },
  { timestamps: true }
);

FeedbackSchema.index({ interviewId: 1, userId: 1 }, { unique: true });

export const Feedback = models.Feedback || model("Feedback", FeedbackSchema);
