// src/pages/AdminPanel.tsx
import { useState } from "react";
import type { Article } from "../mock/articleData";
import { v4 as uuidv4 } from "uuid";
import { useArticles } from "../context/ArticlesContext";

export default function AdminPanel() {
  const { articles, setArticles } = useArticles();
  const [form, setForm] = useState<Article | null>(null);

  const handleEdit = (article: Article) => {
    setForm(article);
  };

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    if (!form?.title || !form.content) return;

    if (form.id && articles.find(a => a.id === form.id)) {
      // Update
      setArticles((prev) =>
        prev.map((a) =>
          a.id === form.id
            ? { ...form, updatedAt: new Date().toISOString() }
            : a
        )
      );
    } else {
      // Add new
      const newArticle = {
        ...form,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      setArticles((prev) => [newArticle, ...prev]);
    }

    setForm(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setForm({ id: "", title: "", content: "", tags: [] })}
      >
        + Add New Article
      </button>

      {form && (
        <div className="space-y-3 border p-4 rounded bg-gray-100 mt-4">
          <input
            className="w-full p-2 border"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full p-2 border h-24"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            className="w-full p-2 border"
            placeholder="Tags (comma separated)"
            value={form.tags?.join(", ") || ""}
            onChange={(e) =>
              setForm({
                ...form,
                tags: e.target.value.split(",").map((t) => t.trim()),
              })
            }
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save Article
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.id} className="border p-4 rounded bg-white shadow-sm">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">{a.title}</h2>
                <p className="text-sm text-gray-600">{a.tags?.join(", ")}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
