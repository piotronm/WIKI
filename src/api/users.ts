// src/api/users.ts
import axios from "./axiosInstance";

export async function checkIfAdmin(userId: string): Promise<boolean> {
  const res = await axios.get(`/User/${userId}`);
  return res.data?.isAdmin === true;
}
