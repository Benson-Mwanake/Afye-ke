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

// Reusable Trending Component (useState is safe here)
const ShowMoreTrending = ({ articles, onArticleClick }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? articles : articles.slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((article) => (
          <div
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
          >
            <ArticleCard article={article} isTrending={true} />
          </div>
        ))}
      </div>

      {articles.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition"
          >
            {showAll ? (
              <>Show Less</>
            ) : (
              <>Show More ({articles.length - 3} more)</>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default function HealthTips() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const urlTopic = searchParams.get("topic");
  const navigate = useNavigate();

  // Fetch articles + build categories
  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:4000/articles", {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Failed to load articles – ${res.status}`);

        const data = await res.json();

        // Build unique categories
        const catSet = new Set(["All"]);
        data.forEach((art) => {
          if (art.category) catSet.add(art.category);
        });
        setCategories(Array.from(catSet));

        setArticles(data);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("HealthTips fetch error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    return () => controller.abort();
  }, []);

  // Auto-select category from URL
  useEffect(() => {
    if (!urlTopic || !categories.length) return;

    const human = urlTopic
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (categories.includes(human)) {
      setSelectedCategory(human);
    }
  }, [urlTopic, categories]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary &&
          article.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.author &&
          article.author.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="text-lg text-gray-600">Loading articles…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

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

        {/* Active Filters */}
        {(selectedCategory !== "All" || searchTerm) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Filtered by:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="ml-1 hover:opacity-70"
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
                  className="ml-1 hover:opacity-70"
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

        {/* Search & Category Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

        {/* Trending Section – 3 by default + Show More */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
          </div>

          {(() => {
            const trending = articles.filter(
              (a) => a.isTrending === true && a.published === true
            );

            return trending.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No trending articles right now.
              </p>
            ) : (
              <ShowMoreTrending
                articles={trending}
                onArticleClick={handleArticleClick}
              />
            );
          })()}
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
                  <ArticleCard article={article} />
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
