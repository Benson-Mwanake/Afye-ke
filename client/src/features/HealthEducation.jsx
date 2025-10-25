import React from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import ArticleCard from "./ArticleCard";
import ArticleDetail from "./ArticleDetail";
import { useParams, useNavigate } from "react-router-dom";

const MOCK_ARTICLES = [
  {
    id: "1",
    title: "How to prevent common infections",
    summary: "Simple everyday steps to reduce infection risk.",
    image: "/logo192.png",
    content:
      "Wash hands regularly, cover your mouth when coughing, and seek care early when symptoms persist.",
    category: "Prevention",
    author: "Afya Team",
    readTime: "3 min",
    date: "2025-10-01",
  },
  {
    id: "2",
    title: "Nutrition tips for children",
    summary: "Key nutrients and meal ideas for growing kids.",
    image: "/logo192.png",
    content:
      "Include protein, fruits, vegetables, and iron-rich foods. Consult community health services for tailored advice.",
    category: "Nutrition",
    author: "Afya Team",
    readTime: "4 min",
    date: "2025-09-15",
  },
];

export default function HealthEducation() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    const article = MOCK_ARTICLES.find((a) => a.id === id);
    if (!article) return <div className="p-6">Article not found</div>;
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto p-6">
          <ArticleDetail article={article} onBack={() => navigate(-1)} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Health Education</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_ARTICLES.map((a) => (
            <div
              key={a.id}
              onClick={() => navigate(`/articles/${a.id}`)}
              className="cursor-pointer"
            >
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
