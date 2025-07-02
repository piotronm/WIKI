// src/api/users.ts
import axios from "./axiosInstance";

export async function checkIfAdmin(): Promise<boolean> {
  const response = await axios.get("/users/check-admin");
  return response.data.isAdmin === true;
}
