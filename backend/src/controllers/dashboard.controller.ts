import { Response } from "express";
import { InterviewSession } from "../models/interviewSession";
import { AuthRequest } from "../middlewares/auth";

export const getAllInterviews = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const interviews = await (InterviewSession as any)
    .find({
      user: req.userId,
    })
    .sort({ createdAt: -1 });

  res.json(interviews);
};

export const getInterviewById = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const interview = await (InterviewSession as any).findOne({
    _id: req.params.id,
    user: req.userId,
  });

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  res.json(interview);
};
