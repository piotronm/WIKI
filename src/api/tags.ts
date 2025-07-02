// src/api/tags.ts
import api from "./axiosInstance";
import type { Tag } from "../types/Tag";

export async function fetchTags(): Promise<Tag[]> {
  const response = await api.get("/tags");
  return response.data;
}
