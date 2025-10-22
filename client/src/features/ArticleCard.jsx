import React from "react";

const ArticleCard = ({ article, onClick }) => (
  <div
    className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer transition overflow-hidden"
    onClick={onClick}
  >
    <img
      src={article.image}
      alt={article.title}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-lg text-blue-700">{article.title}</h3>
      <p className="text-gray-600 text-sm mt-2">{article.summary}</p>
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-3 inline-block">
        {article.category}
      </span>
    </div>
  </div>
);

export default ArticleCard;
