// src/pages/ClinicDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Clock3,
  CheckCircle,
  Star,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://127.0.0.1:5000";

// --- ClinicStatCard (no changes) ---
const ClinicStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
  const colorMap = {
    green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
    blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
    "dark-green": { bg: "bg-teal-600", text: "text-white", trend: "text-teal-200" },
    "light-blue": { bg: "bg-blue-600", text: "text-white", trend: "text-blue-200" },
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

// --- ClinicAppointmentRow (no changes) ---
const ClinicAppointmentRow = ({
  patientName,
  initial,
  service,
  time,
  status,
  isToday,
  onComplete,
  onCancel,
  onReschedule,
}) => {
  let statusClass = "";
  if (status === "Confirmed") statusClass = "bg-green-100 text-green-700";
  else if (status === "Pending") statusClass = "bg-yellow-100 text-yellow-700";
  else if (status === "Cancelled") statusClass = "bg-red-100 text-red-700";

  return (
    <div className="py-4 flex justify-between items-center space-x-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4 flex-grow">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            isToday ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          {initial}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{patientName}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{service}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" /> {time}
          </div>
        </div>
        {isToday && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${statusClass}`}
          >
            {status}
          </span>
        )}
      </div>

      {isToday ? (
        <div className="flex space-x-2">
          <button
            onClick={onComplete}
            className="text-xs font-medium text-green-600 hover:text-green-700"
          >
            Complete
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onCancel}
            className="text-xs font-medium text-red-600 hover:text-red-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={onReschedule}
          className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
        >
          Reschedule
        </button>
      )}
    </div>
  );
};

// --- Main Dashboard ---
const ClinicDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const loadData = async () => {
    if (!user?.clinicId) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [clinicRes, apptRes] = await Promise.all([
        fetch(`${API_URL}/clinics/${user.clinicId}`, { headers }),
        fetch(`${API_URL}/appointments?clinicId=${user.clinicId}`, { headers }),
      ]);

      if (!clinicRes.ok) throw new Error("Failed to fetch clinic");

      const clinicData = await clinicRes.json();
      const appts = await apptRes.json();

      setClinic(clinicData);
      setAppointments(appts);
    } catch (err) {
      console.error("Dashboard load error:", err);
      alert(`Failed to load clinic dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [user, token]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update appointment");

      // Update local state immediately
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
      alert(`Error updating appointment: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-10">Loading clinic dashboard...</div>
      </ClinicDashboardLayout>
    );
  }

  if (!clinic) {
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-10 text-red-600">
          Clinic not found. Please log in as a clinic.
        </div>
      </ClinicDashboardLayout>
    );
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const uniquePatients = new Set(
    appointments.map((a) => a.patientName || a.patientId)
  );

  return (
    <ClinicDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {clinic.name}</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ClinicStatCard
            title="Total Patients"
            value={uniquePatients.size}
            icon={Users}
            color="green"
            trendValue={`This week: ${appointments.length}`}
          />
          <ClinicStatCard
            title="Completed Appointments"
            value={appointments.filter(a => a.status === "Completed").length}
            icon={CheckCircle}
            color="blue"
            trendValue={`${appointments.filter(a => a.status === "Completed").length} reviews`}
          />
          <ClinicStatCard
            title="Average Rating"
            value="4.5"
            icon={Star}
            color="dark-green"
            trendValue="78% 5-star"
          />
          <ClinicStatCard
            title="Average Wait Time"
            value="15m"
            icon={Clock3}
            color="light-blue"
            trendValue=""
          />
        </div>

        {/* Today's Appointments */}
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        {appointments.filter(a => a.date === todayDate).length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          appointments
            .filter(a => a.date === todayDate)
            .map((appt) => (
              <ClinicAppointmentRow
                key={appt.id}
                patientName={appt.patientName || "Unknown"}
                initial={appt.patientName?.[0] || "?"}
                service={appt.service || "N/A"}
                time={appt.time || "N/A"}
                status={appt.status}
                isToday={true}
                onComplete={() => updateAppointmentStatus(appt.id, "Completed")}
                onCancel={() => updateAppointmentStatus(appt.id, "Cancelled")}
                onReschedule={() => navigate(`/appointments/${appt.id}/reschedule`)}
              />
            ))
        )}
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicDashboard;
