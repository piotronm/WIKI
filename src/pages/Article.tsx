// src/pages/Article.tsx
import { useParams } from "react-router-dom";
import { useArticles } from "../context/ArticlesContext";

export default function Article() {
  const { id } = useParams();
  const { articles } = useArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) return <p>Article not found</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="text-gray-600 text-sm">Created: {new Date(article.createdAt || "").toLocaleDateString()}</p>
      <p>{article.content}</p>
      {article.tags && (
        <div className="mt-2">
          <span className="text-sm font-semibold">Tags:</span>{" "}
          {article.tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-200 px-2 py-1 rounded text-xs mr-1">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
