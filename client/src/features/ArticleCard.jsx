// src/features/ArticleCard.jsx
import React from "react";
import { Clock, TrendingUp } from "lucide-react";

const ArticleCard = ({ article, isTrending = false, isSmall = false }) => {
  const {
    category,
    title,
    summary, // <-- matches your DB
    description, // fallback if summary missing
    author,
    readTime,
    date,
    image, // <-- from DB
    isClosed,
  } = article;

  // Use summary first, then description (for backward compatibility)
  const displaySummary = summary || description || "";

  // Fallback image (only if DB missing)
  const imageUrl =
    image ||
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Dynamic classes
  const cardClasses = isSmall ? "p-4" : "p-6";
  const titleClasses = isSmall
    ? "text-lg font-semibold mb-1"
    : "text-xl font-bold mb-2";
  const descriptionClasses = isSmall
    ? "text-sm text-gray-500 line-clamp-2"
    : "text-base text-gray-600 line-clamp-3";
  const metaClasses = isSmall ? "text-xs" : "text-sm";

  // Category badge color
  let categoryColor = "bg-blue-100 text-blue-800";
  if (category?.includes("Health")) categoryColor = "bg-teal-100 text-teal-800";
  if (category?.includes("Nutrition"))
    categoryColor = "bg-yellow-100 text-yellow-800";
  if (category?.includes("Child"))
    categoryColor = "bg-indigo-100 text-indigo-800";
  if (category?.includes("Disease") || category?.includes("Illness"))
    categoryColor = "bg-red-100 text-red-800";
  if (category?.includes("Lifestyle"))
    categoryColor = "bg-purple-100 text-purple-800";
  if (category?.includes("Prevention"))
    categoryColor = "bg-green-100 text-green-800";
  if (category?.includes("Mental")) categoryColor = "bg-pink-100 text-pink-800";

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer ${cardClasses}`}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 -m-1 mb-3 overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {isTrending && (
          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColor}`}
        >
          {category}
        </span>
        {isClosed && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
            Archived
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className={`text-gray-900 ${titleClasses}`}>{title}</h3>
        <p className={descriptionClasses}>{displaySummary}</p>
      </div>

      {/* Meta */}
      <div
        className={`mt-4 pt-4 border-t border-gray-100 flex justify-between items-center ${metaClasses} text-gray-500`}
      >
        <div className="flex items-center space-x-4">
          <p className="font-medium text-gray-700">By {author}</p>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-green-500" />
            <span>{readTime}</span>
          </span>
        </div>
        {date && (
          <span>
            {new Date(date).toLocaleDateString("en-KE", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
