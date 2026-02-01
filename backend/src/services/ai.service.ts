import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateInterviewQuestion = async (resumeText: string, jobDescription: string, previousAnswers: string[] = []) => {
  const prompt = `
You are an expert interviewer.
Job description: ${jobDescription}
Candidate resume: ${resumeText}
Previous answers: ${previousAnswers.join(" | ")}

Ask the next relevant interview question.
Answer ONLY with the question.
`;

//   const response = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7
//   });

//   return response.choices[0].message?.content?.trim() || "Describe yourself.";

const mockQuestions = [
    "Tell me about yourself.",
    "Explain your experience with JavaScript.",
    "Describe a project where you used React.",
    "How do you handle performance issues in web apps?"
  ];

  const index = previousAnswers.length % mockQuestions.length;
  return mockQuestions[index];
  
};
