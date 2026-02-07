import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateInterviewQuestion = async (
  resumeText: string,
  jobDescription: string,
  previousAnswers: string[],
  stage: string
) => {
  const stageInstructions = {
    INTRO:
      "Ask a friendly introductory question to understand the candidate background.",
    TECHNICAL_CORE:
      "Ask a fundamental technical question based on the candidate's primary skills mentioned in the resume.",
    TECHNICAL_DEEP:
      "Ask a deeper follow-up question that tests real-world experience, trade-offs, or performance considerations.",
    PROBLEM_SOLVING:
      "Ask a scenario-based or problem-solving question relevant to the job role.",
  };

  const prompt = `
You are a senior technical interviewer.

Interview stage: ${stage}
Instruction: ${stageInstructions[stage as keyof typeof stageInstructions]}

Job description:
${jobDescription}

Candidate resume:
${resumeText}

Previous answers:
${previousAnswers.join(" | ")}

Rules:
- Ask ONE clear, human-like interview question
- Do NOT ask multiple questions
- Do NOT mention stages
- Keep it professional and conversational

Return ONLY the question.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  return (
    response.choices[0].message?.content?.trim() ||
    "Can you tell me more about your experience?"
  );
};



export const generateInterviewFeedback = async ({
  jobDescription,
  resumeText,
  answers,
}: {
  jobDescription: string;
  resumeText: string;
  answers: string[];
}) => {
  const prompt = `
You are a senior technical interviewer.

Evaluate the candidate based on:
- Job description
- Resume
- Interview answers

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Interview Answers:
${answers.map((a, i) => `Q${i + 1}: ${a}`).join("\n")}

Return feedback STRICTLY in the following JSON format.
DO NOT add explanation, markdown, or extra text.

{
  "score": number (0-10),
  "strengths": string[],
  "improvements": string[],
  "finalVerdict": string
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const raw = response.choices[0].message?.content;

  if (!raw) {
    throw new Error("AI returned empty feedback");
  }

  return JSON.parse(raw);
};

