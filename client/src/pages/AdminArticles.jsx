// src/pages/AdminArticles.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { ClipboardList, Clock, X, TrendingUp } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ArticleSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  category: Yup.string().required("Category is required"),
  readTime: Yup.string()
    .matches(/^\d+\smin$/, "Read time must be in format 'X min'")
    .required("Read time is required"),
  image: Yup.string().url("Invalid URL").required("Image URL is required"),
  published: Yup.boolean(),
});

const AdminArticleRow = ({
  title,
  category,
  date,
  published,
  isTrending,
  onEdit,
  onPublish,
  onDelete,
  onToggleTrending,
}) => {
  const isTrendingBool = isTrending === true;

  return (
    <div className="py-4 flex justify-between items-center space-x-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4 flex-grow">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-blue-500">
          {title
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{category}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {date}
          </div>
        </div>

        <div className="flex gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              published
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {published ? "Published" : "Draft"}
          </span>
          {isTrendingBool && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>
      </div>

      <div className="flex space-x-2 text-xs">
        <button
          onClick={onEdit}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Edit
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={onPublish}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          {published ? "Unpublish" : "Publish"}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={onToggleTrending}
          className={`font-medium ${
            isTrendingBool
              ? "text-orange-600 hover:text-orange-700"
              : "text-gray-600 hover:text-gray-700"
          }`}
        >
          {isTrendingBool ? "Remove Trending" : "Make Trending"}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={onDelete}
          className="font-medium text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ArticleModal = ({ isOpen, onClose, initialValues, onSubmit, isEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit Article" : "New Article"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={ArticleSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="border p-2 w-full rounded"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <Field
                  as="textarea"
                  name="content"
                  className="border p-2 w-full rounded"
                  rows="5"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Field
                    type="text"
                    name="category"
                    className="border p-2 w-full rounded"
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Read Time
                  </label>
                  <Field
                    type="text"
                    name="readTime"
                    className="border p-2 w-full rounded"
                    placeholder="e.g., 5 min"
                  />
                  <ErrorMessage
                    name="readTime"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <Field
                  type="text"
                  name="image"
                  className="border p-2 w-full rounded"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center gap-6 mb-4">
                <label className="flex items-center">
                  <Field type="checkbox" name="published" className="mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Publish
                  </span>
                </label>
                <label className="flex items-center">
                  <Field type="checkbox" name="isTrending" className="mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Make Trending
                  </span>
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isEdit ? "Update Article" : "Create Article"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const AdminArticles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:4000/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();

        const fixedData = data.map((article) => ({
          ...article,
          isTrending: article.isTrending === true ? true : false,
        }));

        setArticles(fixedData);
      } catch (err) {
        console.error("Articles load error:", err);
        alert(`Failed to load articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (values, { setSubmitting }) => {
    try {
      const newArticle = {
        ...values,
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        author: user?.fullName || "Admin",
        summary: values.content.slice(0, 100) + "...",
        isTrending: !!values.isTrending,
      };
      const res = await fetch("http://localhost:4000/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });
      const created = await res.json();
      setArticles((prev) => [...prev, created]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values, { setSubmitting }) => {
    try {
      const updated = {
        ...values,
        summary: values.content.slice(0, 100) + "...",
        isTrending: !!values.isTrending,
      };
      const res = await fetch(
        `http://localhost:4000/articles/${editArticle.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );
      const saved = await res.json();
      setArticles((prev) =>
        prev.map((a) => (a.id === editArticle.id ? saved : a))
      );
      setIsModalOpen(false);
      setEditArticle(null);
    } catch (err) {
      alert("Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id, published) => {
    try {
      const res = await fetch(`http://localhost:4000/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      const updated = await res.json();
      setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      alert("Failed to update article");
    }
  };

  const handleToggleTrending = async (id, current) => {
    const newTrending = !current;
    try {
      const res = await fetch(`http://localhost:4000/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrending: newTrending }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedArticle = await res.json();

      setArticles((prev) =>
        prev.map((a) => (a.id === id ? updatedArticle : a))
      );
    } catch (err) {
      alert("Failed to update trending status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await fetch(`http://localhost:4000/articles/${id}`, {
        method: "DELETE",
      });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          Loading articles...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Manage Articles
        </h1>
        <p className="text-lg text-gray-600">
          Create and manage health articles
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Articles</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Create Article
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {articles.length > 0 ? (
            articles.map((article) => (
              <AdminArticleRow
                key={article.id}
                title={article.title}
                category={article.category}
                date={article.date}
                published={article.published}
                isTrending={article.isTrending}
                onEdit={() => {
                  setEditArticle(article);
                  setIsModalOpen(true);
                }}
                onPublish={() => handlePublish(article.id, article.published)}
                onToggleTrending={() =>
                  handleToggleTrending(article.id, article.isTrending)
                }
                onDelete={() => handleDelete(article.id)}
              />
            ))
          ) : (
            <p className="text-gray-500 py-4">No articles available.</p>
          )}
        </div>
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditArticle(null);
        }}
        initialValues={
          editArticle || {
            title: "",
            content: "",
            category: "",
            readTime: "",
            image: "",
            published: false,
            isTrending: false,
          }
        }
        onSubmit={editArticle ? handleEdit : handleCreate}
        isEdit={!!editArticle}
      />
    </AdminLayout>
  );
};

export default AdminArticles;
