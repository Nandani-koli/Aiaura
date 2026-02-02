// Dashboard API calls
import api from "../utils/axios";

export const getInterviewHistory = () => {
  return api.get("/dashboard/interviews");
};

export const getInterviewById = (id: string) => {
  return api.get(`/dashboard/interviews/${id}`);
};
