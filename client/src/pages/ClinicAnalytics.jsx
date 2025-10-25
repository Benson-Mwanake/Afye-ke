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
} from "recharts";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const ClinicAnalytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    monthly: [],
    services: [],
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.clinicId) return;
      const res = await fetch(
        `http://localhost:4000/appointments?clinicId=${user.clinicId}`
      );
      const appts = await res.json();

      const monthly = Array(12).fill(0);
      const services = {};

      appts.forEach((a) => {
        const month = new Date(a.date).getMonth();
        monthly[month]++;
        services[a.service] = (services[a.service] || 0) + 1;
      });

      const serviceData = Object.entries(services).map(([name, value]) => ({
        name,
        value,
      }));

      setStats({
        monthly: monthly.map((v, i) => ({ month: i + 1, appts: v })),
        services: serviceData,
        loading: false,
      });
    };
    fetchStats();
  }, [user]);

  if (stats.loading)
    return <div className="p-8 text-center">Loading analytics...</div>;

    return (
      <ClinicDashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Clinic Analytics</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Appointments by Month
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appts" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Services Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.services} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </ClinicDashboardLayout>
    );
};

export default ClinicAnalytics;
