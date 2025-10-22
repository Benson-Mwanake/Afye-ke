import React, { useState } from "react";
import ArticleCard from "./ArticleCard";
import CategoryFilter from "./CategoryFilter";
import ArticleDetail from "./ArticleDetail";

const articles = [
  {
    id: 1,
    title: "Preventing Malaria in Your Community",
    category: "Prevention",
    summary:
      "Learn effective ways to protect yourself and your family from malaria.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    content:
      "Use treated mosquito nets, eliminate stagnant water, and seek early treatment when symptoms appear...",
  },
  {
    id: 2,
    title: "Healthy Nutrition Tips",
    category: "Nutrition",
    summary:
      "A balanced diet keeps your immune system strong and reduces disease risk.",
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    content:
      "Eat more fruits, vegetables, and whole grains. Reduce sugar, salt, and processed foods...",
  },
];

const HealthEducation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">
        Health Education
      </h2>

      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => setSelectedArticle(article)}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthEducation;
