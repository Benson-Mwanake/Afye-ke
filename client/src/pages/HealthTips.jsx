// src/pages/HealthTips.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import ArticleCard from "../features/ArticleCard";
import ArticleDetail from "../features/ArticleDetail";
import { articles, categories, slugToCategory } from "../services/articles";

export default function HealthTips() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const urlTopic = searchParams.get("topic");
  const navigate = useNavigate();

  // Auto-filter from URL
  useEffect(() => {
    if (urlTopic && slugToCategory[urlTopic]) {
      setSelectedCategory(slugToCategory[urlTopic]);
    }
  }, [urlTopic]);

  // Real-time filtering with useMemo
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
    navigate("/health-tips", { replace: true });
  };

  const clearFilter = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    navigate("/health-tips", { replace: true });
  };

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <ArticleDetail article={selectedArticle} onBack={handleBack} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Health Tips
          </h1>
          <p className="text-lg text-gray-600">
            Stay informed with expert advice on wellness, prevention, and care.
          </p>
        </div>

        {/* Active Filter Badge */}
        {(selectedCategory !== "All" || searchTerm) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Filtered by:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="ml-1 hover:opacity-70 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:opacity-70 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilter}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Real-time Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles
              .filter((a) => a.isTrending)
              .map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="cursor-pointer"
                >
                  <ArticleCard article={article} isTrending={true} />
                </div>
              ))}
          </div>
        </div>

        {/* All Articles */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory !== "All"
                ? `${selectedCategory} Articles`
                : "All Articles"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                No articles match your search.
              </p>
              <button
                onClick={clearFilter}
                className="mt-4 text-green-600 hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
                >
                  <ArticleCard article={article} isClosed={article.isClosed} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/all-health-education")}
            className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition"
          >
            View All Articles
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
