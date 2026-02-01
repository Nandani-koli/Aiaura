export interface InterviewSession {
  sessionId: string;
  jobDescription: string;
  resumeText: string;
  answers: string[];
  completed: boolean;
}

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  finalVerdict: string;
}
