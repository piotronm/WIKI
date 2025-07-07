// src/components/ArticleCard.tsx
import { Link } from "react-router-dom";
import type { Article } from "../types/Article";

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  const { id, title, platform, category, description } = article;

  return (
    <Link to={`/article/${id}`}>
      <div className="border p-4 rounded hover:bg-gray-100 space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{category} • {platform}</p>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}
