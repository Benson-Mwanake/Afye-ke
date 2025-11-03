// src/pages/clinic/ClinicAppointments.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";
import api from "../services/api";

const ClinicAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.clinicId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/appointments?clinicId=${user.clinicId}`);
        const appts = Array.isArray(res.data) ? res.data : [];

        // Sort by date and time
        const sorted = appts.sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        });

        setAppointments(sorted);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        alert("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/appointments/${id}`, { status: "Completed" });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark appointment as completed");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}`, { status: "Cancelled" });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };

  const filtered = appointments.filter((appt) => {
    const patientName = appt.patientName || "Unknown";

    const matchesSearch =
      patientName.toLowerCase().includes(search.toLowerCase()) ||
      (appt.patientEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (appt.patientPhone || "").includes(search);

    const matchesStatus =
      filterStatus === "all" || appt.status === filterStatus;

    const matchesDate = !filterDate || appt.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <ClinicDashboardLayout>
        <div className="p-8 text-center">Loading appointments...</div>
      </ClinicDashboardLayout>
    );
  }

  return (
    <ClinicDashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Appointments
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {appointments.length} total appointment
                {appointments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => navigate("/clinic-profile")}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Clock className="w-4 h-4" />
              <span>Set Availability</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 w-full transition"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 w-full appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 w-full"
              />
            </div>
          </div>

          {/* Appointments List */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {search || filterStatus !== "all" || filterDate
                ? "No appointments match your filters."
                : "No appointments yet."}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((appt) => {
                const patientName = appt.patientName || "Unknown";
                const isPast =
                  new Date(appt.date) < new Date().setHours(0, 0, 0, 0);
                const isToday =
                  appt.date === new Date().toISOString().split("T")[0];

                let statusClass = "";
                let statusIcon = null;
                if (appt.status === "Completed") {
                  statusClass = "bg-green-100 text-green-700";
                  statusIcon = <CheckCircle className="w-4 h-4" />;
                } else if (appt.status === "Cancelled") {
                  statusClass = "bg-red-100 text-red-700";
                  statusIcon = <XCircle className="w-4 h-4" />;
                } else if (appt.status === "Confirmed") {
                  statusClass = "bg-blue-100 text-blue-700";
                } else {
                  statusClass = "bg-yellow-100 text-yellow-700";
                }

                return (
                  <div
                    key={appt.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {patientName}
                        </p>
                        <p className="text-sm text-gray-500">{appt.service}</p>
                        <p className="text-sm text-gray-500">{formatDate(appt.date)} at {formatTime(appt.time)}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass} flex items-center space-x-1`}>
                        {statusIcon}
                        <span>{appt.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicAppointments;
