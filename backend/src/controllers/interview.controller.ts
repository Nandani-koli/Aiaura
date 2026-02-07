import { Response } from "express";
import { Types } from "mongoose";
import { generateInterviewQuestion, generateInterviewFeedback } from "../services/ai.service";
import { InterviewSession } from "../models/interviewSession";
import { AuthRequest } from "../middlewares/auth";


export const safeGenerateQuestion = async (
  resumeText: string,
  jobDescription: string,
  answers: string[],
  stage: string
): Promise<string> => {
  try {
    const question = await generateInterviewQuestion(
      resumeText,
      jobDescription,
      answers,
      stage
    );

    if (!question || question.length < 5) {
      throw new Error("Invalid AI question");
    }

    return question;
  } catch (error) {
    console.error("AI Question Generation Failed:", error);

    const fallbackQuestions: Record<string, string> = {
      INTRO:
        "Could you walk me through your background and what you’ve been working on recently?",
      TECHNICAL_CORE:
        "Can you explain how React works and how you manage state in your applications?",
      TECHNICAL_DEEP:
        "How do you optimize performance in a React application?",
      PROBLEM_SOLVING:
        "Can you describe a challenging bug you faced and how you solved it?",
      CLOSING:
        "Do you have any questions for us?",
    };

    return fallbackQuestions[stage] ?? fallbackQuestions.TECHNICAL_CORE;
  }
};


// Start interview
export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDescription, resumeText } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const session = await InterviewSession.create({
      user: req.userId as any,
      jobDescription,
      resumeText,
      answers: [],
      completed: false,
      stage: "INTRO",
    });

    return res.status(200).json({
      sessionId: session._id,
      firstQuestion:
        "Hi! Thanks for joining today. To get started, could you briefly introduce yourself and tell me about your recent work experience?",
    });
  } catch (error) {
    console.error("Start Interview Error:", error);
    return res.status(500).json({
      error: "Failed to start interview",
    });
  }
};


// Submit answer
const MAX_QUESTIONS = 5;

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  const { sessionId, answer } = req.body;

  if (!req.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const session = await InterviewSession.findOne({
    _id: sessionId as any,
    user: req.userId as any,
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.answers.push(answer);

  if (session.answers.length === 1) session.stage = "TECHNICAL_CORE";
  if (session.answers.length === 3) session.stage = "TECHNICAL_DEEP";
  if (session.answers.length === 4) session.stage = "PROBLEM_SOLVING";

  let nextQuestion: string | null = null;

  if (session.answers.length < MAX_QUESTIONS) {
    nextQuestion = await safeGenerateQuestion(
      session.resumeText,
      session.jobDescription,
      session.answers,
      session.stage
    );
  } else {
    session.stage = "CLOSING";
    session.completed = true;
    nextQuestion =
      "Thanks for your time today. This concludes our interview. We’ll share detailed feedback shortly. Have a great day!";
  }

  await session.save();

  return res.status(200).json({
    nextQuestion,
    isCompleted: session.completed,
  });
};

const fallbackFeedback = {
  score: 6,
  strengths: ["Good communication basics"],
  improvements: ["Add more technical depth", "Use examples"],
  finalVerdict: "Interview completed. Feedback is limited due to system issue.",
};


export const getFeedback = async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  const session = await InterviewSession.findOne({
    _id: sessionId as any,
    user: req.userId as any,
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  // Return cached feedback
  if (session.feedback?.score) {
    return res.status(200).json(session);
  }

  try {
    const feedback = await generateInterviewFeedback({
      jobDescription: session.jobDescription,
      resumeText: session.resumeText,
      answers: session.answers,
    });

    // Safety guard
    if (
      !feedback.score ||
      !Array.isArray(feedback.strengths) ||
      !Array.isArray(feedback.improvements)
    ) {
      throw new Error("Invalid feedback structure from AI");
    }

    session.feedback = feedback;
    session.completed = true;
    await session.save();

    return res.status(200).json(session);
  } catch (error) {
    console.error("AI feedback error:", error);

    session.feedback = fallbackFeedback;
    session.completed = true;
    await session.save();

    return res.status(200).json(session.feedback);
  }
};


