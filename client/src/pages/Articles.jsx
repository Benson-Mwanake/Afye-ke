// src/pages/Articles.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://afya-ke.onrender.com";

const ArticleCard = ({ id, title, summary, readTime }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/article/${id}`)}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{summary}</p>
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {readTime}
      </div>
    </div>
  );
};

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadArticles = async () => {
      try {
        const res = await fetch(`${API_URL}/articles`, {
          signal: controller.signal,
        });
        const data = res.ok ? await res.json() : [];
        const published = data.filter((a) => a.published);
        setArticles(published);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
    return () => controller.abort();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Articles
        </h1>
        <p className="text-gray-600 mb-8">
          Stay informed with evidence-based health tips.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading articles...</p>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                id={a.id}
                title={a.title}
                summary={a.summary}
                readTime={a.readTime}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No articles available.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
