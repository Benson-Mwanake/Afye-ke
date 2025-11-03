// src/pages/AllHealthEducation.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { Search, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopicCard = ({ title, count, slug, onClick }) => (
  <button
    onClick={() => onClick(slug)}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-green-400 transition-all duration-200 transform hover:scale-105"
  >
    <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
    <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{count} articles</p>
  </button>
);

export default function AllHealthEducation() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopics = async () => {
      try {
        const res = await fetch("https://afya-ke.onrender.com/articles", {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Failed to load articles – ${res.status}`);

        const articles = await res.json();

        // Build topics: { title, slug, count }
        const topicMap = {};

        articles.forEach((art) => {
          const cat = art.category || "General";
          if (!topicMap[cat]) {
            topicMap[cat] = {
              title: cat,
              slug: cat.toLowerCase().replace(/\s+/g, "-"),
              count: 0,
            };
          }
          topicMap[cat].count += 1;
        });

        const topicList = Object.values(topicMap);
        setTopics(topicList);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("AllHealthEducation fetch error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();

    return () => controller.abort();
  }, []);

  const handleTopicClick = (slug) => {
    navigate(`/health-tips?topic=${slug}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-lg text-gray-600">Loading topics…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Health Education
        </h1>
        <p className="text-gray-600 mb-6">
          Browse by topic or search for specific advice.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              title={topic.title}
              count={topic.count}
              slug={topic.slug}
              onClick={handleTopicClick}
            />
          ))}
        </div>

        {/* Back to Tips */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/health-tips")}
            className="text-green-600 hover:underline font-medium"
          >
            Back to All Tips
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
