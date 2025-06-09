// src/pages/Home.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useArticles } from "../context/ArticlesContext";

export default function Home() {
  const { articles } = useArticles();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const handleTagClick = (tag: string) => {
    setActiveTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filtered = articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.content.toLowerCase().includes(query.toLowerCase())
    )
    .filter((a) => {
      if (activeTags.size === 0) return true;
      return (a.tags || []).some((tag) => activeTags.has(tag));
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags || [])));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>

      <SearchBar query={query} setQuery={setQuery} />

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Filter by tags:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-2 py-1 rounded text-sm ${
                activeTags.has(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div>
          <select
            className="border px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {filtered.map((a) => (
          <li
            key={a.id}
            className="border p-4 rounded bg-white shadow-sm"
          >
            <Link
              to={`/article/${a.id}`}
              className="text-lg font-semibold text-blue-600"
            >
              <HighlightedText text={a.title} query={query} />
            </Link>
            <p className="text-gray-600 text-sm">
              {new Date(a.createdAt || "").toLocaleDateString()}
            </p>
            {a.tags && (
              <div className="mt-1 space-x-1">
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-gray-500">No articles found.</p>
      )}
    </div>
  );
}

// Helper component to highlight search terms
function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
