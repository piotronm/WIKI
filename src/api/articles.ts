import api from "./axiosInstance";
import type { Article } from "../context/ArticlesContext";

// Fetch all articles
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await api.get("/articles");
    return response.data;
  } catch (error) {
    console.error("API fetch failed, falling back to local JSON:", error);
    const fallbackResponse = await fetch("/mock/articles.json");
    if (!fallbackResponse.ok) {
      throw new Error(`Failed to load fallback data. Status: ${fallbackResponse.status}`);
    }
    const fallbackData = await fallbackResponse.json();
    return fallbackData;
  }
}

// Fetch single article by ID
export async function fetchArticleById(id: string): Promise<Article> {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`API fetch by ID failed for article ${id}. Falling back to local JSON.`, error);
    // Try fallback JSON
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


// Create a new article
export async function createArticle(newArticle: Partial<Article>): Promise<Article> {
  try {
    const response = await api.post("/articles", newArticle);
    return response.data;
  } catch (error) {
    console.error("API create failed. Simulating article creation.", error);
    const simulatedArticle: Article = {
      id: Date.now().toString(),
      title: newArticle.title || "Untitled",
      content: newArticle.content || "",
      tags: newArticle.tags || [],
      createdAt: new Date().toISOString(),
    };
    return simulatedArticle;
  }
}

// Update an existing article
export async function updateArticle(id: string, updatedArticle: Partial<Article>): Promise<Article> {
  try {
    const response = await api.put(`/articles/${id}`, updatedArticle);
    return response.data;
  } catch (error) {
    console.error(`API update failed for article ${id}. Simulating update.`, error);
    const simulatedArticle: Article = {
      id,
      title: updatedArticle.title || "Untitled",
      content: updatedArticle.content || "",
      tags: updatedArticle.tags || [],
      updatedAt: new Date().toISOString(),
    };
    return simulatedArticle;
  }
}


// Delete an article
export async function deleteArticle(id: string): Promise<void> {
  try {
    await api.delete(`/articles/${id}`);
  } catch (error) {
    console.error(`API delete failed for article ${id}. Simulating delete.`, error);
    // No-op: Simulate delete success.
  }
}

