import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  getAllInterviews,
  getInterviewById,
} from "../controllers/dashboard.controller";

const router = Router();

// SAME PATTERN AS INTERVIEW
router.get("/interviews", authMiddleware, getAllInterviews);
router.get("/interviews/:id", authMiddleware, getInterviewById);

export default router;
