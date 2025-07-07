// src/api/articles.ts
import api from "./axiosInstance";
import type { Article } from "../types/Article";
import { fetchTagsForArticle } from "./tags";
import { normalizeArticle } from "../utils/normalize";

// --- Fetch all articles ---
export async function fetchArticles(): Promise<Article[]> {
  const response = await api.get("/Knowledge");
  const rawArticles = response.data;

  const normalized: Article[] = await Promise.all(
    rawArticles.map(async (a: any) => {
      try {
        const tagObjects = await fetchTagsForArticle(a.Id);
        return normalizeArticle({ ...a, Tags: tagObjects.map(t => t.id) });
      } catch (e) {
        console.error("Failed to load tags for article", a.Id, e);
        return normalizeArticle({ ...a, Tags: [] });
      }
    })
  );

  return normalized;
}

// --- Fetch article by ID ---
export async function fetchArticleById(id: string): Promise<Article> {
  const response = await api.get(`/Knowledge/${id}`);
  const raw = response.data;

  try {
    const tagObjects = await fetchTagsForArticle(raw.Id);
    return normalizeArticle({ ...raw, Tags: tagObjects.map(t => t.id) });
  } catch (e) {
    console.error("Failed to load tags for article", id, e);
    return normalizeArticle({ ...raw, Tags: [] });
  }
}

// --- Create new article ---
export async function createArticle(newArticle: Partial<Article>): Promise<Article> {
  const payload = {
    Platform: newArticle.platform ?? "",
    Category: newArticle.category ?? "",
    Title: newArticle.title ?? "",
    Description: newArticle.description ?? "",
    ImageUrl1: newArticle.imageUrl1 ?? "",
    ImageUrl2: newArticle.imageUrl2 ?? "",
    DateCreated: newArticle.dateCreated ?? new Date().toISOString(),
    Segment: newArticle.segment ?? "",
    Solution: newArticle.solution ?? "",
    UserId: newArticle.userId ?? "", 
  };

  const response = await api.post("/Knowledge", payload);

  const saved = response.data;

  if (newArticle.tags?.length && saved.Id) {
    await setTagsForArticle(saved.Id, newArticle.tags);
  }

  return normalizeArticle({ ...saved, Tags: newArticle.tags || [] });
}


// --- Update existing article ---
export async function updateArticle(id: string, updatedArticle: Partial<Article>): Promise<Article> {
  const payload = {
    Id: id,
    Platform: updatedArticle.platform ?? "",
    Category: updatedArticle.category ?? "",
    Title: updatedArticle.title ?? "",
    Description: updatedArticle.description ?? "",
    ImageUrl1: updatedArticle.imageUrl1 ?? "",
    ImageUrl2: updatedArticle.imageUrl2 ?? "",
    DateCreated: updatedArticle.dateCreated ?? new Date().toISOString(),
    Segment: updatedArticle.segment ?? "",
    Solution: updatedArticle.solution ?? "",
    UserId: updatedArticle.userId ?? "",
  };

  const response = await api.put(`/Knowledge/${id}`, payload);
  const updated = response.data;

  if (updatedArticle.tags?.length) {
    await setTagsForArticle(id, updatedArticle.tags);
  }

  return normalizeArticle({ ...updated, Tags: updatedArticle.tags || [] });
}


// --- Associate tags (IDs) with an article ---
export async function setTagsForArticle(articleId: string, tagIds: string[]): Promise<void> {
  await api.post(`/BaseTag/${articleId}`, tagIds);
}

// --- Delete article ---
export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/Knowledge/${id}`);
}

// --- Fetch all tags ---
export async function fetchTags(): Promise<{ id: string; name: string }[]> {
  const response = await api.get("/Tag");
  return response.data.map((tag: any) => ({
    id: tag.Id,
    name: tag.Name,
  }));
}
