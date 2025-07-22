// src/utils/normalize.ts
import type { Article } from "../types/Article";

export const normalizeArticle = (raw: any): Article => ({
  id: raw.Id,
  title: raw.Title,
  description: raw.Description,
  category: raw.Category,
  platform: raw.Platform ?? raw.platform ?? "",
  dateCreated: raw.DateCreated,
  segment: raw.Segment ?? raw.segment ?? "",
  solution: raw.Solution ?? "",
  imageUrl1: raw.ImageUrl1 ?? "",
  imageUrl2: raw.ImageUrl2 ?? "",
  userId: raw.UserId ?? "",
  tags: raw.Tags || [],
});
