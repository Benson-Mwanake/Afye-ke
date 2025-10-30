import React, { useState, useEffect } from "react";
import { Users, BriefcaseMedical, Calendar, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";

// --- Reusable Admin Cards ---
const AdminStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
  const colorMap = {
    green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
    blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
    "dark-green": { bg: "bg-teal-600", text: "text-white", trend: "text-teal-200" },
    "light-blue": { bg: "bg-blue-600", text: "text-white", trend: "text-blue-200" },
  };
  const { bg, text, trend } = colorMap[color] || { bg: "bg-gray-600", text: "text-white", trend: "text-gray-200" };

  return (
    <div className={`${bg} p-6 sm:p-7 md:p-8 rounded-xl shadow-lg flex flex-col justify-between h-full`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>{title}</h3>
        <div className={`p-2 sm:p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${text}`} />
        </div>
      </div>
      <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>{value}</p>
      <p className={`mt-2 text-sm ${trend} font-medium`}>{trendValue}</p>
    </div>
  );
};

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

// --- Edit Article Modal ---
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

// --- Main Dashboard ---
const AdminDashboard = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("authToken");

  const [clinics, setClinics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editArticle, setEditArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [clinicsRes, articlesRes, usersRes, reportsRes, appointmentsRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/clinics", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:5000/articles", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:5000/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:5000/reports", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:5000/appointments", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!clinicsRes.ok || !articlesRes.ok || !usersRes.ok || !reportsRes.ok || !appointmentsRes.ok)
          throw new Error("Failed to fetch data");

        const [clinicsData, articlesData, usersData, reportsData, appointmentsData] = await Promise.all([
          clinicsRes.json(),
          articlesRes.json(),
          usersRes.json(),
          reportsRes.json(),
          appointmentsRes.json(),
        ]);

        setClinics(clinicsData);
        setArticles(articlesData);
        setUsers(usersData);
        setReports(reportsData);
        setAppointments(appointmentsData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // --- Handlers ---
  const handleApproveClinic = async id => {
    try {
      await fetch(`http://127.0.0.1:5000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "approved", verified: true }),
      });
      setClinics(prev => prev.map(c => (c.id === id ? { ...c, status: "approved", verified: true } : c)));
    } catch {
      alert("Failed to approve clinic");
    }
  };

  const handleRejectClinic = async id => {
    if (!window.confirm("Reject this clinic?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "rejected", verified: false }),
      });
      setClinics(prev => prev.map(c => (c.id === id ? { ...c, status: "rejected", verified: false } : c)));
    } catch {
      alert("Failed to reject clinic");
    }
  };

  const handleDeleteUser = async id => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleDeleteArticle = async id => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/articles/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Failed to delete article");
    }
  };

  const handleSaveArticle = async updated => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/articles/${updated.id}`, {
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

  const filteredUsers = users.filter(u => filter === "all" || u.role === filter);

  if (loading) return <AdminLayout><div className="flex items-center justify-center min-h-screen">Loading admin dashboard...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {user?.fullName || "Admin"}</p>
      </div>

      {/* --- Top Stats --- */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <AdminStatCard title="Total Users" value={users.length} icon={Users} color="green" trendValue={`${users.filter(u => u.role==="patient").length} patients`} />
          <AdminStatCard title="Registered Clinics" value={clinics.filter(c => c.status==="approved").length} icon={BriefcaseMedical} color="blue" trendValue={`${clinics.filter(c=>c.status==="pending").length} pending`} />
          <AdminStatCard title="Appointments" value={appointments.length} icon={Calendar} color="dark-green" trendValue="Today" />
          <AdminStatCard title="Published Articles" value={articles.filter(a => a.published).length} icon={ClipboardList} color="light-blue" trendValue="Latest" />
        </div>
      </section>

      {/* --- Detailed Management Sections --- */}

      {/* Clinics */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Clinic Approvals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clinics.map(c => (
            <AdminCard key={c.id} title={c.name} subtitle={c.location} status={c.status}
              actions={[
                { label: "Approve", onClick: () => handleApproveClinic(c.id), color: "text-green-600" },
                { label: "Reject", onClick: () => handleRejectClinic(c.id), color: "text-red-600" }
              ]}
            >
              <p className="text-xs text-gray-500 mt-1">{c.email}</p>
            </AdminCard>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Articles Management</h2>
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
      </section>

      {/* Users */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <select className="border p-2 rounded" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="admin">Admins</option>
            <option value="patient">Patients</option>
            <option value="clinic">Clinics</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map(u => (
            <AdminCard key={u.id} title={u.fullName} subtitle={u.email}
              actions={[{ label: "Delete", onClick: () => handleDeleteUser(u.id), color: "text-red-600" }]}
            >
              <p className="text-xs text-gray-500">{u.role}</p>
            </AdminCard>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">Failed to fetch reports or none available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reports.map(r => (
              <AdminCard key={r.id} title={r.title} subtitle={r.description} />
            ))}
          </div>
        )}
      </section>

      {/* Edit Article Modal */}
      {editArticle && <EditArticleModal article={editArticle} onClose={() => setEditArticle(null)} onSave={handleSaveArticle} />}
    </AdminLayout>
  );
};

export default AdminDashboard;
