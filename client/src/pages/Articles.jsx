import React from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ id, title, excerpt, readTime }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/article/${id}`)}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{excerpt}</p>
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {readTime}
      </div>
    </div>
  );
};

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: "How to Prevent Malaria in Kenya",
      excerpt:
        "Malaria remains a major health concern. Learn about nets, repellents, and early symptoms.",
      readTime: "6 min",
    },
    {
      id: 2,
      title: "Nutrition for Pregnant Mothers",
      excerpt:
        "Essential vitamins and balanced meals for a healthy pregnancy and baby.",
      readTime: "5 min",
    },
    {
      id: 3,
      title: "Managing Diabetes at Home",
      excerpt: "Daily habits, diet tips, and when to seek medical help.",
      readTime: "7 min",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Articles
        </h1>
        <p className="text-gray-600 mb-8">
          Stay informed with evidence-based health tips.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} {...a} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
