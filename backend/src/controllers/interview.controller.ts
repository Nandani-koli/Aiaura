import { Response } from "express";
import { Types } from "mongoose";
import { generateInterviewQuestion } from "../services/ai.service";
import { InterviewSession } from "../models/interviewSession";
import { AuthRequest } from "../middlewares/auth";

// Start interview
export const startInterview = async (req: AuthRequest, res: Response) => {
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
  });

  const firstQuestion = await generateInterviewQuestion(
    resumeText,
    jobDescription,
    []
  );

  return res.status(200).json({
    sessionId: session._id,
    firstQuestion,
  });
};

// Submit answer
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

  const nextQuestion = await generateInterviewQuestion(
    session.resumeText,
    session.jobDescription,
    session.answers
  );

  if (!nextQuestion) {
    session.completed = true;
  }

  await session.save();

  return res.status(200).json({
    nextQuestion,
    isCompleted: session.completed,
  });
};



// Get feedback
export const getFeedback = async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body;

  if (!req.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const session = await (InterviewSession as any).findOne({
    _id: sessionId,
    user: req.userId,
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  // ✅ If feedback already exists, return it
  if (session.feedback) {
    return res.status(200).json(session.feedback);
  }

  // 🔹 REAL feedback logic (still rule-based, not random)
  const answerCount = session.answers.length;

  const feedback = {
    score: Math.min(10, 4 + answerCount),
    strengths: [
      "Clear communication",
      answerCount > 3 ? "Good technical depth" : "Basic understanding",
    ],
    improvements: [
      "Use more real-world examples",
      "Structure answers more clearly",
    ],
    finalVerdict:
      answerCount >= 4
        ? "Strong candidate for the role"
        : "Decent fundamentals, needs improvement",
  };

  session.feedback = feedback;
  session.completed = true;

  await session.save();

  return res.status(200).json(feedback);
};

