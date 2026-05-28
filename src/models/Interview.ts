import { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const InterviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["junior", "mid", "senior"],
      required: true,
    },
    type: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      required: true,
    },
    techstack: { type: [String], default: [] },
    questions: { type: [QuestionSchema], default: [] },
    finalized: { type: Boolean, default: false },
    coverImage: { type: String, default: "" },
  },
  { timestamps: true }
);

InterviewSchema.index({ userId: 1, createdAt: -1 });

export const Interview =
  models.Interview || model("Interview", InterviewSchema);
