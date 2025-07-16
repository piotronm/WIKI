import api from "./axiosInstance";
import type { Tag } from "../types/Tag";

export async function fetchTags(): Promise<Tag[]> {
  const response = await api.get("/Tag");

  console.log("Normalized tags:", response.data);
  const normalizedTags: Tag[] = response.data.map((tag: any): Tag => ({
    id: tag.Id,
    name: tag.Name,
  }));

  return normalizedTags.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchTagsForArticle(articleId: string): Promise<Tag[]> {
  const response = await api.get(`/BaseTag/${articleId}`);

  const articleTags: Tag[] = response.data.map((tag: any): Tag => ({
    id: tag.Id,
    name: tag.Name,
  }));

  return articleTags;
}
