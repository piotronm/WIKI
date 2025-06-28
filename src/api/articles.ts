import api from "./axiosInstance";
import type { Article } from "../types/Article";

// --- Internal flag to track mock usage ---
let usedMockArticles = false;
export function wasMockUsedForArticles() {
  return usedMockArticles;
}

// --- 1. Fetch all articles ---
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await api.get("/articles");
    usedMockArticles = false;
    return response.data;
  } catch (error) {
    console.warn("API fetch failed, using fallback JSON:", error);
    const fallbackResponse = await fetch("/mock/articles.json");
    if (!fallbackResponse.ok) {
      throw new Error(`Failed to load fallback data. Status: ${fallbackResponse.status}`);
    }
    usedMockArticles = true;
    return await fallbackResponse.json();
  }
}

// --- 2. Fetch all tags ---
let usedMockTags = false;

export function wasMockUsedForTags() {
  return usedMockTags;
}

export async function fetchTags(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await api.get("/tags");
    usedMockTags = false;
    return response.data;
  } catch (error) {
    console.warn("API fetch failed for tags, using fallback tags.json", error);
    const fallback = await fetch("/mock/tags.json");
    if (!fallback.ok) throw new Error("Failed to load fallback tags.");
    usedMockTags = true;
    return await fallback.json();
  }
}




// --- 3. Fetch single article by ID ---
export async function fetchArticleById(id: string): Promise<Article> {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`API fetch by ID failed for article ${id}, using fallback JSON.`, error);
    const fallbackResponse = await fetch("/mock/articles.json");
    if (!fallbackResponse.ok) {
      throw new Error(`Failed to load fallback data. Status: ${fallbackResponse.status}`);
    }
    const fallbackData: Article[] = await fallbackResponse.json();
    const fallbackArticle = fallbackData.find((a) => a.id === id);
    if (!fallbackArticle) {
      throw new Error(`Article with ID ${id} not found in fallback data.`);
    }
    return fallbackArticle;
  }
}

// --- 4. Create a new article ---
export async function createArticle(newArticle: Partial<Article>): Promise<Article> {
  try {
    const response = await api.post("/articles", newArticle);
    return response.data;
  } catch (error) {
    console.warn("API create failed. Simulating article creation.", error);
    const simulatedArticle: Article = {
      id: Date.now().toString(),
      title: newArticle.title || "Untitled",
      description: newArticle.description || "",
      platform: newArticle.platform || "N/A",
      category: newArticle.category || "General",
      tags: newArticle.tags || [],
      dateCreated: new Date().toISOString(),
      imageUrl1: "",
      imageUrl2: "",
      segment: "",
      solution: "",
      userId: "mock-user",
    };
    return simulatedArticle;
  }
}

// --- 5. Update an existing article ---
export async function updateArticle(id: string, updatedArticle: Partial<Article>): Promise<Article> {
  try {
    const response = await api.put(`/articles/${id}`, updatedArticle);
    return response.data;
  } catch (error) {
    console.warn(`API update failed for article ${id}. Simulating update.`, error);
    const simulatedArticle: Article = {
      id,
      title: updatedArticle.title || "Untitled",
      description: updatedArticle.description || "",
      platform: updatedArticle.platform || "N/A",
      category: updatedArticle.category || "General",
      tags: updatedArticle.tags || [],
      dateCreated: new Date().toISOString(),
      imageUrl1: "",
      imageUrl2: "",
      segment: "",
      solution: "",
      userId: "mock-user",
    };
    return simulatedArticle;
  }
}

// --- 6. Delete an article ---
export async function deleteArticle(id: string): Promise<void> {
  try {
    await api.delete(`/articles/${id}`);
  } catch (error) {
    console.warn(`API delete failed for article ${id}. Simulating delete.`, error);
    // No-op: simulate success
  }
}
