// src/pages/clinic/ClinicAppointments.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit3,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://127.0.0.1:5000";

const ClinicAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
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
        const [apptRes, patientRes] = await Promise.all([
          fetch(`${API_URL}/appointments?clinicId=${user.clinicId}`),
          fetch(`${API_URL}/users?role=patient`),
        ]);

        const [appts, patients] = await Promise.all([
          apptRes.json(),
          patientRes.json(),
        ]);

        const map = {};
        patients.forEach((p) => (map[p.id] = p));
        setPatientsMap(map);

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
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const handleComplete = async (id) => {
    await fetch(`${API_URL}/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed" }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
    );
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await fetch(`${API_URL}/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
    );
  };

  const filtered = appointments.filter((appt) => {
    const patient = patientsMap[appt.patientId] || {};
    const matchesSearch =
      (patient.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (patient.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (patient.phoneNumber || "").includes(search);

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
                const patient = patientsMap[appt.patientId] || {};
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                      {/* Left: Patient & Service */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {(patient.fullName || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {patient.fullName || "Unknown Patient"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appt.service || "General Checkup"}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {formatDate(appt.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {formatTime(appt.time)}
                            </span>
                            {isToday && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status & Actions */}
                      <div className="flex items-center space-x-3">
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                        >
                          {statusIcon}
                          <span>{appt.status}</span>
                        </span>

                        {appt.status === "Pending" ||
                        appt.status === "Confirmed" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleComplete(appt.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Complete"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleCancel(appt.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/clinic-reschedule/${appt.id}`)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Reschedule"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/clinic-reschedule/${appt.id}`)
                            }
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            title="Reschedule"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Patient Contact (mobile) */}
                    <div className="md:hidden mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1" /> {patient.email}
                      </p>
                      <p className="flex items-center mt-1">
                        <Phone className="w-3.5 h-3.5 mr-1" />{" "}
                        {patient.phoneNumber}
                      </p>
                    </div>

                    {/* Patient Contact (desktop) */}
                    <div className="hidden md:flex justify-end space-x-4 text-sm text-gray-600 mt-3">
                      <span className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1" /> {patient.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1" />{" "}
                        {patient.phoneNumber}
                      </span>
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
