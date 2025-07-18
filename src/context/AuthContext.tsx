// src/context/AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import type { ReactNode } from "react";

type User = {
  token: string;
  role: "admin" | "viewer";
};

type AuthContextType = {
  user: User | null;
  login: (token: string, role: "admin" | "viewer") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as User["role"] | null;
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token: string, role: "admin" | "viewer") => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
