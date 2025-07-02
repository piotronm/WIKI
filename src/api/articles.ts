// src/api/article.ts
import api from "./axiosInstance";
import type { Article } from "../types/Article";
import { fetchTagsForArticle } from "./tags"; 

// --- Fetch all articles ---
export async function fetchArticles(): Promise<Article[]> {
  const response = await api.get("/Knowledge");
  const articles = response.data;

  const normalized: Article[] = await Promise.all(
    articles.map(async (a: any) => {
      let tagNames: string[] = [];

      try {
        const tagObjects = await fetchTagsForArticle(a.Id);
        tagNames = tagObjects.map((tag) => tag.name); 
      } catch (e) {
        console.error("Failed to load tags for article", a.Id, e);
      }

      return {
        id: a.Id,
        title: a.Title,
        description: a.Description,
        category: a.Category,
        platform: a.Platform,
        dateCreated: a.DateCreated,
        segment: a.Segment ?? "",
        solution: a.Solution ?? "",
        imageUrl1: a.ImageUr11 ?? "",
        imageUrl2: a.ImageUr12 ?? "",
        userId: a.UserId ?? "",
        tags: tagNames,
      };
    })
  );

  return normalized;
}

// --- Fetch article by ID ---
export async function fetchArticleById(id: string): Promise<Article> {
  const response = await api.get(`/Knowledge/${id}`);
  const a = response.data;

  let tagNames: string[] = [];

  try {
    const tagObjects = await fetchTagsForArticle(a.Id);
    tagNames = tagObjects.map((tag) => tag.name); 
  } catch (e) {
    console.error("Failed to load tags for article", id, e);
  }

  return {
    id: a.Id,
    title: a.Title,
    description: a.Description,
    category: a.Category,
    platform: a.Platform,
    dateCreated: a.DateCreated,
    segment: a.Segment ?? "",
    solution: a.Solution ?? "",
    imageUrl1: a.ImageUr11 ?? "",
    imageUrl2: a.ImageUr12 ?? "",
    userId: a.UserId ?? "",
    tags: tagNames,
  };
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
