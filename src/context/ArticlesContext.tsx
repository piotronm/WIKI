// src/context/ArticlesContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Define the Article type
export type Article = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
};

const STORAGE_KEY = "wiki_articles";

type ArticlesContextType = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  loading: boolean;
};

// Initialize the context
const ArticlesContext = createContext<ArticlesContextType | null>(null);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && JSON.parse(saved).length > 0) {
      console.log("Articles loaded from localStorage:", saved);
      setArticles(JSON.parse(saved));
      setLoading(false);
    } else {
      console.log("No localStorage data found. Fetching from /mock/articles.json...");
      fetch("/mock/articles.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch articles. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Articles loaded from JSON:", data);
          setArticles(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load articles:", error);
          setArticles([]);
          setLoading(false);
        });
    }
  }, []);
  
  

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  return (
    <ArticlesContext.Provider value={{ articles, setArticles, loading }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};
