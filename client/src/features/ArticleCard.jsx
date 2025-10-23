import React from "react";
import { Clock } from "lucide-react";

const ArticleCard = ({ article, isTrending = false, isSmall = false }) => {
  const { category, title, description, author, readTime, date, isClosed } =
    article;

  // Dynamically set classes based on card size
  const cardClasses = isSmall ? "p-4" : "p-6";

  const titleClasses = isSmall
    ? "text-lg font-semibold mb-1"
    : "text-xl font-bold mb-2";

  const descriptionClasses = isSmall
    ? "text-sm text-gray-500 line-clamp-2"
    : "text-base text-gray-600 line-clamp-3";

  const metaClasses = isSmall ? "text-xs" : "text-sm";

  // Determine the category badge style
  let categoryColor = "bg-blue-100 text-blue-800";
  if (category.includes("Health")) categoryColor = "bg-teal-100 text-teal-800";
  if (category.includes("Nutrition"))
    categoryColor = "bg-yellow-100 text-yellow-800";
  if (category.includes("Child"))
    categoryColor = "bg-indigo-100 text-indigo-800";
  if (category.includes("Disease")) categoryColor = "bg-red-100 text-red-800";

  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 transition duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer ${cardClasses}`}
    >
      <div className="mb-3 flex justify-between items-center">
        {/* Category Badge */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColor}`}
        >
          {category}
        </span>

        {/* Status/Trending Badge */}
        {(isTrending || isClosed) && (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isTrending ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isTrending ? "🔥 Trending" : "Archived"}
          </span>
        )}
      </div>

      <div className="flex-grow">
        <h3 className={`text-gray-900 ${titleClasses}`}>{title}</h3>
        <p className={descriptionClasses}>{description}</p>
      </div>

      <div
        className={`mt-4 pt-4 border-t border-gray-100 flex justify-between items-center ${metaClasses} text-gray-500`}
      >
        {/* Author & Read Time */}
        <div className="flex items-center space-x-4">
          <p className="font-medium text-gray-700">By {author}</p>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-green-500" />
            <span>{readTime}</span>
          </span>
        </div>

        {/* Date (for smaller cards) */}
        {date && <span>{date}</span>}
      </div>
    </div>
  );
};

export default ArticleCard;
