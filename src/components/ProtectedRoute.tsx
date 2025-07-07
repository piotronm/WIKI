import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { checkIfAdmin } from "../api/users";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return setIsAdmin(false);

    checkIfAdmin(user.token)
      .then((res) => setIsAdmin(res))
      .catch(() => setIsAdmin(false));
  }, [user]);

  if (isAdmin === null) return null; 
  return isAdmin ? <>{children}</> : <Navigate to="/unauthorized" />;
}
