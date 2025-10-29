// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  BriefcaseMedical,
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { checkSystemHealth } from "../services/healthService";

// Admin Stat Card
const AdminStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
  const colorMap = {
    green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
    blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
    "dark-green": {
      bg: "bg-teal-600",
      text: "text-white",
      trend: "text-teal-200",
    },
    "light-blue": {
      bg: "bg-blue-600",
      text: "text-white",
      trend: "text-blue-200",
    },
  };
  const { bg, text, trend } = colorMap[color] || {
    bg: "bg-gray-600",
    text: "text-white",
    trend: "text-gray-200",
  };

  return (
    <div
      className={`${bg} p-6 sm:p-7 md:p-8 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl flex flex-col justify-between h-full`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>
          {title}
        </h3>
        <div className={`p-2 sm:p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${text}`} />
        </div>
      </div>
      <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>
        {value}
      </p>
      <p className={`mt-2 text-sm ${trend} font-medium`}>{trendValue}</p>
    </div>
  );
};

// Pending Approval Row
const AdminPendingApprovalRow = ({
  clinicName,
  location,
  email,
  onApprove,
  onReject,
}) => {
  return (
    <div className="py-4 flex justify-between items-center space-x-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4 flex-grow">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-blue-500">
          {clinicName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{clinicName}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {email}
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
          Pending
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onApprove}
          className="text-xs font-medium text-green-600 hover:text-green-700"
        >
          Approve
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={onReject}
          className="text-xs font-medium text-red-600 hover:text-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

// Main Dashboard
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [health, setHealth] = useState({
    server: "Checking...",
    database: "Checking...",
    apiResponse: "Checking...",
    latency: "...",
    version: "N/A",
  });
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clinicsRes, usersRes, appointmentsRes, articlesRes] =
          await Promise.all([
            fetch("http://localhost:4000/clinics"),
            fetch("http://localhost:4000/users"),
            fetch("http://localhost:4000/appointments"),
            fetch("http://localhost:4000/articles"),
          ]);

        if (
          !clinicsRes.ok ||
          !usersRes.ok ||
          !appointmentsRes.ok ||
          !articlesRes.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [clinicsData, usersData, appointmentsData, articlesData] =
          await Promise.all([
            clinicsRes.json(),
            usersRes.json(),
            appointmentsRes.json(),
            articlesRes.json(),
          ]);

        setClinics(clinicsData);
        setUsers(usersData);
        setAppointments(appointmentsData);
        setArticles(articlesData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Health Check
  useEffect(() => {
    const check = async () => {
      try {
        const data = await checkSystemHealth();
        setHealth(data);
      } catch (err) {
        setHealth({
          server: "Error",
          database: "Failed",
          apiResponse: "Failed",
          latency: "N/A",
          version: "N/A",
        });
      }
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Filters
  const pendingApprovals = clinics.filter((c) => c.status === "pending");
  const approvedClinics = clinics.filter((c) => c.status === "approved").length;
  const totalPatients = users.filter((u) => u.role === "patient").length;
  const publishedArticles = articles.filter((a) => a.published).length;

  // Actions
  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:4000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", verified: true }),
      });
      setClinics((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "approved", verified: true } : c
        )
      );
    } catch (err) {
      alert("Failed to approve clinic");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this clinic?")) return;
    try {
      await fetch(`http://localhost:4000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", verified: false }),
      });
      setClinics((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "rejected", verified: false } : c
        )
      );
    } catch (err) {
      alert("Failed to reject clinic");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          Loading admin dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back, {user?.fullName || "Admin"}
        </p>
      </div>

      {/* Stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <AdminStatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="green"
            trendValue={`${totalPatients} patients`}
          />
          <AdminStatCard
            title="Registered Clinics"
            value={approvedClinics}
            icon={BriefcaseMedical}
            color="blue"
            trendValue={`${pendingApprovals.length} pending`}
          />
          <AdminStatCard
            title="Total Appointments"
            value={appointments.length}
            icon={Calendar}
            color="dark-green"
            trendValue="All time"
          />
          <AdminStatCard
            title="Published Articles"
            value={publishedArticles}
            icon={ClipboardList}
            color="light-blue"
            trendValue={`${articles.length - publishedArticles} drafts`}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Pending Clinic Approvals
              </h2>
              <button
                onClick={() => navigate("/admin-approvals")}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingApprovals.length > 0 ? (
                pendingApprovals
                  .slice(0, 5)
                  .map((clinic) => (
                    <AdminPendingApprovalRow
                      key={clinic.id}
                      clinicName={clinic.name}
                      location={clinic.location}
                      email={clinic.email}
                      onApprove={() => handleApprove(clinic.id)}
                      onReject={() => handleReject(clinic.id)}
                    />
                  ))
              ) : (
                <p className="text-gray-500 py-4">No pending approvals.</p>
              )}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Articles
              </h2>
              <button
                onClick={() => navigate("/admin-articles")}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {articles.length > 0 ? (
                articles.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {article.category}
                      </p>
                      <p className="text-sm text-gray-500">{article.date}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        article.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4">No articles available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Admin Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 text-white font-bold text-2xl rounded-full flex items-center justify-center mb-3">
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "A"}
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {user?.fullName || "Admin"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">County Health Officer</p>
            <button
              onClick={() => navigate("/admin-profile")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>

          {/* System Overview – DYNAMIC */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              System Overview
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Server Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      health.server === "Healthy"
                        ? "bg-green-500"
                        : health.server === "Warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      health.server === "Healthy"
                        ? "text-green-800"
                        : health.server === "Warning"
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {health.server}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600">Database</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      health.database === "Optimal"
                        ? "bg-green-500"
                        : health.database === "Error"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      health.database === "Optimal"
                        ? "text-green-800"
                        : health.database === "Error"
                        ? "text-red-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {health.database}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600">API Response</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      health.apiResponse === "Good"
                        ? "bg-green-500"
                        : health.apiResponse === "Slow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      health.apiResponse === "Good"
                        ? "text-green-800"
                        : health.apiResponse === "Slow"
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {health.apiResponse} ({health.latency})
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <p className="text-gray-600">Version</p>
                <p className="font-mono text-xs text-gray-700">
                  v{health.version}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Updated every 30s</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin-approvals")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-medium">Review Approvals</span>
              </button>
              <button
                onClick={() => navigate("/admin-articles")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <ClipboardList className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">Manage Articles</span>
              </button>
              <button
                onClick={() => navigate("/admin-reports")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <ClipboardList className="w-5 h-5 mr-3 text-indigo-500" />
                <span className="font-medium">View Reports</span>
              </button>
              <button
                onClick={() => navigate("/admin-users")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <Users className="w-5 h-5 mr-3 text-teal-500" />
                <span className="font-medium">Manage Users</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
