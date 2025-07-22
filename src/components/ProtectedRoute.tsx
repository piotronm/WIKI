import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
