// src/api/article.ts
import api from "./axiosInstance";
import type { Article } from "../types/Article";

// --- Fetch all articles ---
export async function fetchArticles(): Promise<Article[]> {
  const response = await api.get("/Knowledge");
  return response.data;
}

// --- Fetch article by ID ---
export async function fetchArticleById(id: string): Promise<Article> {
  const response = await api.get(`/Knowledge/${id}`);
  return response.data;
}

// --- Create new article ---
export async function createArticle(newArticle: Partial<Article>): Promise<Article> {
  const response = await api.post("/Knowledge", newArticle);
  return response.data;
}

// --- Update article ---
export async function updateArticle(id: string, updatedArticle: Partial<Article>): Promise<Article> {
  const response = await api.put(`/Knowledge/${id}`, updatedArticle);
  return response.data;
}

// --- Delete article ---
export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/Knowledge/${id}`);
}

// --- Fetch all tags ---
export async function fetchTags(): Promise<{ id: string; name: string }[]> {
  const response = await api.get("/Tag");
  return response.data;
}
