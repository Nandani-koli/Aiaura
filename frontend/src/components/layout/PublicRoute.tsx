// Public Route - Redirects to dashboard if user is already logged in
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (user || token) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PublicRoute;
