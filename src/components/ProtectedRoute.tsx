import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/unauthorized" />;
  return user.role === "admin" ? <>{children}</> : <Navigate to="/unauthorized" />;
}
