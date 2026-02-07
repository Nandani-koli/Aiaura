import { Schema, model, Document } from "mongoose";

export interface IInterviewSession extends Document {
    user: Schema.Types.ObjectId;
    jobDescription: string;
    resumeText: string;
    answers: string[];
    completed: boolean;
    createdAt: Date;
    feedback?: {
        score: number;
        strengths: string[];
        improvements: string[];
        finalVerdict: string;
    };
    stage: "INTRO" | "TECHNICAL_CORE" | "TECHNICAL_DEEP" | "PROBLEM_SOLVING" | "CLOSING";
}

const InterviewSessionSchema = new Schema<IInterviewSession>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    jobDescription: { type: String, required: true },
    resumeText: { type: String, required: true },
    answers: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    feedback: {
        score: { type: Number },
        strengths: { type: [String] },
        improvements: { type: [String] },
        finalVerdict: { type: String },
    },
    stage: {
        type: String,
        enum: ["INTRO", "TECHNICAL_CORE", "TECHNICAL_DEEP", "PROBLEM_SOLVING", "CLOSING"],
        default: "INTRO"
    }


});

export const InterviewSession = model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
