// src/context/ArticlesContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchArticles } from "../api/articles";
import type { Article } from "../types/Article";

type ArticlesContextType = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  loading: boolean;
  refreshArticles: () => Promise<void>;
};

const ArticlesContext = createContext<ArticlesContextType | null>(null);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshArticles();
  }, []);

  return (
    <ArticlesContext.Provider
      value={{ articles, setArticles, loading, refreshArticles }}>
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
