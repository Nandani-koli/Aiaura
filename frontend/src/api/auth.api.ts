// Authentication API calls
import api from "../utils/axios";

export const loginApi = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const meApi = () => api.get("/auth/me");
