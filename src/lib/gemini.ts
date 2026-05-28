import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import type { FeedbackData, InterviewLevel, InterviewType } from "@/types";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("[gemini] GEMINI_API_KEY is not set. AI features will fail.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const MODEL_NAME = "gemini-flash-latest";

function getModel(responseSchema?: Schema) {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.8,
      responseMimeType: "application/json",
      ...(responseSchema ? { responseSchema } : {}),
    },
  });
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const baseDelay = options.baseDelayMs ?? 800;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const retriable =
        /fetch failed|network|ECONN|ETIMEDOUT|503|502|504|overloaded|429/i.test(
          msg
        );
      if (!retriable || i === attempts - 1) break;
      const delay = baseDelay * Math.pow(2, i);
      console.warn(
        `[gemini${options.label ? ":" + options.label : ""}] attempt ${i + 1} failed (${msg.slice(0, 80)}). Retrying in ${delay}ms...`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function extractJSON<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Strip trailing commas inside arrays/objects (a common LLM JSON sin)
    const noTrailingCommas = cleaned.replace(/,(\s*[}\]])/g, "$1");
    try {
      return JSON.parse(noTrailingCommas) as T;
    } catch {
      // Last-ditch: grab the largest balanced { } block
      const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        const candidate = match[0].replace(/,(\s*[}\]])/g, "$1");
        return JSON.parse(candidate) as T;
      }
      throw new Error("Failed to parse AI response as JSON");
    }
  }
}

const QUESTIONS_SCHEMA: Schema = {
  type: SchemaType.ARRAY,
  items: { type: SchemaType.STRING },
};

const FEEDBACK_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  required: [
    "totalScore",
    "categoryScores",
    "strengths",
    "areasForImprovement",
    "finalAssessment",
  ],
  properties: {
    totalScore: { type: SchemaType.NUMBER },
    categoryScores: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        required: ["name", "score", "comment"],
        properties: {
          name: { type: SchemaType.STRING },
          score: { type: SchemaType.NUMBER },
          comment: { type: SchemaType.STRING },
        },
      },
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    areasForImprovement: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    finalAssessment: { type: SchemaType.STRING },
  },
};

export async function generateInterviewQuestions(params: {
  role: string;
  level: InterviewLevel;
  type: InterviewType;
  techstack: string[];
  amount: number;
}): Promise<string[]> {
  const model = getModel(QUESTIONS_SCHEMA);
  const prompt = `You are an expert interview coach. Generate ${params.amount} interview questions tailored for the following candidate profile:

Role: ${params.role}
Experience Level: ${params.level}
Interview Type: ${params.type} (${
    params.type === "technical"
      ? "focus on coding, system design, and tech concepts"
      : params.type === "behavioral"
        ? "focus on STAR-method behavioral scenarios"
        : "mix of technical and behavioral"
  })
Tech Stack: ${params.techstack.join(", ")}

Rules:
- Questions must be open-ended and answerable verbally (no code-writing tasks).
- Difficulty must match the experience level (${params.level}).
- Avoid generic questions. Make them specific to the role and tech stack.
- Do not include any special characters like "/", "*", "&", or markdown.
- Each question should be a single, complete sentence.

Return a JSON array of strings.`;

  const result = await withRetry(
    () => model.generateContent(prompt),
    { label: "questions" }
  );
  const text = result.response.text();
  const questions = extractJSON<string[]>(text);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid questions response");
  }

  return questions.slice(0, params.amount);
}

export async function generateFeedback(params: {
  role: string;
  level: InterviewLevel;
  type: InterviewType;
  transcript: { question: string; answer: string }[];
}): Promise<FeedbackData> {
  const model = getModel(FEEDBACK_SCHEMA);

  // Cap each answer at 2k chars to keep prompt within model limits.
  const formattedTranscript = params.transcript
    .map((t, i) => {
      const ans = (t.answer || "(no answer provided)").slice(0, 2000);
      return `Q${i + 1}: ${t.question}\nA${i + 1}: ${ans}`;
    })
    .join("\n\n");

  const prompt = `You are a strict but fair interview evaluator. Analyse this mock interview and return structured feedback.

Candidate Profile:
- Role: ${params.role}
- Level: ${params.level}
- Interview type: ${params.type}

Transcript:
${formattedTranscript}

Score the candidate from 0 to 100 across these 5 categories (use exactly these names):
- "Communication Skills" — clarity, structure, articulation
- "Technical Knowledge" — depth, accuracy, relevance to the role
- "Problem-Solving" — approach, reasoning, creativity
- "Cultural & Role Fit" — alignment with role expectations, professionalism
- "Confidence & Clarity" — composure, conviction, conciseness

Rules:
- totalScore is a weighted average (0-100).
- Provide 3 specific strengths and 3 actionable improvement areas.
- finalAssessment is 2-3 sentences with a hiring recommendation.
- Reference the actual answers given. If answers are empty/short, score low.
- Use plain text only (no markdown, no special chars).`;

  const result = await withRetry(
    () => model.generateContent(prompt),
    { label: "feedback" }
  );
  const text = result.response.text();
  const feedback = extractJSON<FeedbackData>(text);

  if (
    typeof feedback.totalScore !== "number" ||
    !Array.isArray(feedback.categoryScores)
  ) {
    throw new Error("Invalid feedback response");
  }

  return feedback;
}
