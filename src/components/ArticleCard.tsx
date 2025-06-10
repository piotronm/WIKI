// src/components/ArticleCard.tsx
import { Link } from "react-router-dom";

type Props = {
  title: string;
  id: string;
};

export default function ArticleCard({ title, id }: Props) {
  return (
    <Link to={`/article/${id}`}>
      <div className="border p-4 rounded hover:bg-gray-100">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </Link>
  );
}
