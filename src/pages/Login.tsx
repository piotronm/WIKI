// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `/api/User?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (res.ok && data?.isAdmin !== undefined) {
        login("mock-token", data.isAdmin ? "admin" : "viewer"); // or replace token if real one is returned
        navigate("/admin");
      } else {
        setError("Invalid credentials or no admin access.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
