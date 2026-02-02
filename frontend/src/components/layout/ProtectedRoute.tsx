// Protected Route component
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!user && !token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
