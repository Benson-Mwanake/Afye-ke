// src/pages/clinic/ClinicAnalytics.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "https://gadgetreview-5c3b.onrender.com";

const ClinicAnalytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    monthly: [],
    services: [],
    statusBreakdown: [],
    totalAppts: 0,
    completedAppts: 0,
    cancelledAppts: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const clinicId = user?.role === "clinic" ? user.clinicId : null;
      if (!clinicId) {
        setStats((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/appointments?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch appointments: ${res.status}`);

        const appts = await res.json();

        if (!Array.isArray(appts)) {
          throw new Error("Invalid appointments data from server");
        }

        const monthly = Array(12).fill(0);
        const services = {};
        const statusCount = {
          Completed: 0,
          Pending: 0,
          Confirmed: 0,
          Cancelled: 0,
        };

        appts.forEach((a) => {
          const date = new Date(a.date);
          const month = date.getMonth();
          monthly[month]++;

          const serviceName =
            a.service && typeof a.service === "string" && a.service.trim()
              ? a.service.trim()
              : "General Checkup";

          services[serviceName] = (services[serviceName] || 0) + 1;

          const status = a.status || "Pending";
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const serviceData = Object.entries(services)
          .map(([name, value]) => ({
            name: name.length > 20 ? name.substring(0, 17) + "..." : name,
            value: Number(value),
          }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        const statusData = Object.entries(statusCount)
          .filter(([, value]) => value > 0)
          .map(([name, value]) => ({ name, value }));

        setStats({
          monthly: monthly.map((v, i) => ({ month: monthNames[i], appts: v })),
          services: serviceData,
          statusBreakdown: statusData,
          totalAppts: appts.length,
          completedAppts: statusCount.Completed || 0,
          cancelledAppts: statusCount.Cancelled || 0,
          loading: false,
        });
      } catch (err) {
        console.error("Analytics error:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [user]);

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  if (stats.loading) {
    return (
      <ClinicDashboardLayout>
        <div className="p-8 text-center">Loading analytics...</div>
      </ClinicDashboardLayout>
    );
  }

  return (
    <ClinicDashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clinic Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track performance and patient trends
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {stats.totalAppts}
            </p>
            <p className="text-sm text-gray-500">Total Appointments</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-lg font-semibold opacity-90">Completed</h3>
            <p className="text-3xl font-bold mt-2">{stats.completedAppts}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-lg font-semibold opacity-90">
              Pending/Confirmed
            </h3>
            <p className="text-3xl font-bold mt-2">
              {stats.totalAppts - stats.completedAppts - stats.cancelledAppts}
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-lg font-semibold opacity-90">Cancelled</h3>
            <p className="text-3xl font-bold mt-2">{stats.cancelledAppts}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Appointments by Month */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Appointments by Month
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={stats.monthly}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#111827", fontWeight: "bold" }}
                />
                <Bar dataKey="appts" fill="#48bb78" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top Services
            </h2>

            <div className="space-y-4">
              {stats.services.length > 0 ? (
                stats.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-40 text-sm font-medium text-gray-700 truncate">
                      {service.name}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                        style={{
                          width: `${
                            (service.value /
                              Math.max(...stats.services.map((s) => s.value), 1)) *
                            100
                          }%`,
                        }}
                      >
                        {service.value}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No appointments yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Pie Chart */}
        {stats.statusBreakdown.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Appointment Status
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={280} className="max-w-xs">
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {stats.statusBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicAnalytics;
