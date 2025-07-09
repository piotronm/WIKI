// src/context/TagsContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Tag } from "../types/Tag";
import { fetchTags } from "../api/tags";

type TagsContextType = {
  tags: Tag[];
  loading: boolean;
  refreshTags: () => void;
};

const TagsContext = createContext<TagsContextType | null>(null);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await fetchTags();
      setTags(data);
    } catch (error) {
      console.error("Failed to load tags:", error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <TagsContext.Provider value={{ tags, loading, refreshTags: loadTags }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
};
