import React from "react";

const ArticleDetail = ({ article, onBack }) => (
  <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
    <button onClick={onBack} className="text-blue-600 mb-4 hover:underline">
      ← Back
    </button>
    <img
      src={article.image}
      alt={article.title}
      className="w-full h-64 object-cover rounded mb-4"
    />
    <h2 className="text-2xl font-bold text-blue-700 mb-2">{article.title}</h2>
    <p className="text-gray-700 leading-relaxed">{article.content}</p>
  </div>
);

export default ArticleDetail;
