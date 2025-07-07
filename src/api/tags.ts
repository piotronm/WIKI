// src/api/tags.ts
import api from "./axiosInstance";
import type { Tag } from "../types/Tag";

/**
 * Fetch all available tags from the server.
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await api.get("/Tag");

  const normalizedTags: Tag[] = response.data.map((tag: any): Tag => ({
    id: tag.Id,
    name: tag.Name,
  }));

  return normalizedTags.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch tags associated with a specific article by article ID.
 */
export async function fetchTagsForArticle(articleId: string): Promise<Tag[]> {
  const response = await api.get(`/BaseTag/${articleId}`);

  const articleTags: Tag[] = response.data.map((tag: any): Tag => ({
    id: tag.Id,
    name: tag.Name,
  }));

  return articleTags;
}

/**
 * Associate a set of tag IDs with an article by its ID.
 */
export async function setTagsForArticle(articleId: string, tagIds: string[]): Promise<void> {
  await api.post(`/BaseTag/${articleId}`, tagIds);
}
