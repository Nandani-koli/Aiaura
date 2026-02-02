// Interview API calls
import api from "../utils/axios";

export const startInterviewApi = (data: {
  jobDescription: string;
  resumeText: string;
}) => {
  return api.post("/interview/start", data);
};

export const submitAnswerApi = (data: {
  sessionId: string;
  answer: string;
}) => {
  return api.post("/interview/answer", data);
};

export const getFeedbackApi = (sessionId: string) => {
  return api.post("/interview/feedback", { sessionId });
};
