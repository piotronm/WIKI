// src/pages/Article.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";
import type { Article as ArticleType } from "../types/Article";
import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Tooltip title="Go Back">
          <IconButton
            onClick={() => navigate(-1)}
            size="medium"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 2,
              padding: "8px 12px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </div>

      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="text-gray-600 text-sm">
        Created: {new Date(article.dateCreated || "").toLocaleDateString()}
      </p>
      <p>{article.description}</p>
      {article.tags && (
        <div className="mt-2">
          <span className="text-sm font-semibold">Tags:</span>{" "}
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 px-2 py-1 rounded text-xs mr-1">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
