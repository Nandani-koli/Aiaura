import { Router } from "express";
import { startInterview, submitAnswer, getFeedback } from "../controllers/interview.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/start", authMiddleware, startInterview);
router.post("/answer", authMiddleware, submitAnswer);
router.post("/feedback", authMiddleware, getFeedback);

export default router;
