// src/utils/normalize.ts
import type { Article } from "../types/Article";

export const normalizeArticle = (raw: any): Article => ({
  id: raw.Id,
  title: raw.Title,
  description: raw.Description,
  category: raw.Category,
  platform: raw.Platform,
  dateCreated: raw.DateCreated,
  segment: raw.Segment ?? "",
  solution: raw.Solution ?? "",
  imageUrl1: raw.ImageUr11 ?? "",
  imageUrl2: raw.ImageUr12 ?? "",
  userId: raw.UserId ?? "",
  tags: raw.Tags || [],
});
