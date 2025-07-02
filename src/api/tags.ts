import api from "./axiosInstance";
import type { Tag } from "../types/Tag";

export async function fetchTags(): Promise<Tag[]> {
  const response = await api.get("/Tag");

  console.log("Normalized tags:", response.data);
  // Map API fields to match frontend expectations
  return response.data.map((tag: any) => ({
    id: tag.Id,
    name: tag.Name,
  }));
}
