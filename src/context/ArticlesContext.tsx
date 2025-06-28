import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchArticles, wasMockUsedForArticles } from "../api/articles"; // <- also import this
import type { Article } from "../types/Article"; // centralized type

type ArticlesContextType = {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  loading: boolean;
  usedMock: boolean;
};

// Initialize the context
const ArticlesContext = createContext<ArticlesContextType | null>(null);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usedMock, setUsedMock] = useState<boolean>(false); // <- new state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles();
        setArticles(data);
        setUsedMock(wasMockUsedForArticles()); // <- update after fetch
      } catch (error) {
        console.error("Failed to load articles:", error);
        setArticles([]);
        setUsedMock(true); // Assume mock if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ArticlesContext.Provider
      value={{ articles, setArticles, loading, usedMock }}
    >
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
