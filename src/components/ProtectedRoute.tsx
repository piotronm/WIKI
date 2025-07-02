// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkIfAdmin } from "../api/users";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkIfAdmin()
      .then((res) => setIsAdmin(res))
      .catch(() => setIsAdmin(false)); // fallback to unauthorized
  }, []);

  if (isAdmin === null) return null; // Or loading spinner

  return isAdmin ? <>{children}</> : <Navigate to="/unauthorized" />;
}
