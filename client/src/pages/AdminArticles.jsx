import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";

// Reusable Admin Card
const AdminCard = ({ title, subtitle, status, actions, children }) => {
  return (
    <div className="group bg-white p-4 rounded-xl shadow hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          {status && (
            <span
              className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status}
            </span>
          )}
        </div>
        {actions && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
            {actions.map((action, i) => (
              <button key={i} onClick={action.onClick} className={`text-sm font-medium ${action.color}`}>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

// Edit Article Modal
const EditArticleModal = ({ article, onClose, onSave }) => {
  const [form, setForm] = useState({ title: "", author: "", category: "", published: false });

  useEffect(() => {
    if (article) setForm(article);
  }, [article]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await onSave(form);
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Article</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Author</label>
            <input type="text" name="author" value={form.author} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} className="border p-2 w-full rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <label className="text-sm font-medium">Published</label>
          </div>
          <div className="flex justify-end space-x-2 mt-3">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminArticles = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("authToken");

  const [articles, setArticles] = useState([]);
  const [editArticle, setEditArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (!token) return;
      try {
        const res = await fetch("https://afya-ke.onrender.com/articles", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Articles load error:", err);
        alert(`Failed to load articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [token]);

  const handleDeleteArticle = async id => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await fetch(`https://afya-ke.onrender.com/articles/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Failed to delete article");
    }
  };

  const handleSaveArticle = async updated => {
    try {
      const res = await fetch(`https://afya-ke.onrender.com/articles/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save article");
      const updatedArticle = await res.json();
      setArticles(prev => prev.map(a => (a.id === updatedArticle.id ? updatedArticle : a)));
      setEditArticle(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center min-h-screen">Loading articles...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Articles Management</h1>
        <p className="text-lg text-gray-600">Manage all published and draft articles here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {articles.map(a => (
          <AdminCard key={a.id} title={a.title} subtitle={a.author}
            actions={[
              { label: "Edit", onClick: () => setEditArticle(a), color: "text-blue-600" },
              { label: "Delete", onClick: () => handleDeleteArticle(a.id), color: "text-red-600" }
            ]}
          >
            <p className="text-xs text-gray-500">{a.category} • {a.published ? "Published" : "Draft"}</p>
          </AdminCard>
        ))}
      </div>

      {editArticle && <EditArticleModal article={editArticle} onClose={() => setEditArticle(null)} onSave={handleSaveArticle} />}
    </AdminLayout>
  );
};

export default AdminArticles;
