// src/utils/normalize.ts
import type { Article } from "../types/Article";

// Normalize data from BACKEND (PascalCase keys)
export const normalizeFromBackend = (raw: any): Article => ({
  id: raw.Id,
  title: raw.Title,
  description: raw.Description,
  category: raw.Category,
  platform: raw.Platform,
  dateCreated: raw.DateCreated,
  segment: raw.Segment ?? "",
  solution: raw.Solution ?? "",
  imageUrl1: raw.ImageUrl1 ?? "",
  imageUrl2: raw.ImageUrl2 ?? "",
  userId: raw.UserId ?? "",
  tags: raw.Tags || [],
});

//Normalize article data in frontend (camelCase)
export const normalizeArticle = (raw: any): Article => ({
  id: raw.id ?? "",
  title: raw.title ?? "",
  description: raw.description ?? "",
  category: raw.category ?? "",
  platform: raw.platform ?? "",
  dateCreated: raw.dateCreated ?? new Date().toISOString(),
  segment: raw.segment ?? "",
  solution: raw.solution ?? "",
  imageUrl1: raw.imageUrl1 ?? "",
  imageUrl2: raw.imageUrl2 ?? "",
  userId: raw.userId ?? "",
  tags: raw.tags || [],
});
