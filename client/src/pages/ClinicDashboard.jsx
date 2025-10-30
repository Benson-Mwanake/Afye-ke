// src/pages/ClinicDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Clock3,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://127.0.0.1:5000";

// ------------------------------------------------------------------
// 1. Stat Card
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// 2. Appointment Row
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// 3. Operating Hours Component
// ------------------------------------------------------------------
const OperatingHours = ({ hours }) => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });

  return (
    <div className="space-y-1.5">
      {hours.map((slot) => {
        const isToday = slot.day === today;
        const timeText = slot.closed ? "Closed" : `${slot.open} – ${slot.close}`;

        return (
          <div
            key={slot.day}
            className={`flex justify-between items-center py-1.5 px-2 rounded-md transition-all ${
              isToday
                ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            <span className={`text-sm ${isToday ? "text-blue-900" : "text-gray-700"}`}>
              {slot.day}
            </span>
            <span
              className={`text-sm font-medium ${
                slot.closed ? "text-red-600" : isToday ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {timeText}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------
// 4. Main Dashboard
// ------------------------------------------------------------------
const ClinicDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadData = async () => {
      console.log("User object:", user); // Debug
      if (!user?.clinicId) {
        console.warn("No clinicId found for user.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [clinicRes, apptRes, patientRes] = await Promise.all([
          fetch(`${API_URL}/clinics/${user.clinicId}`, { headers }),
          fetch(`${API_URL}/appointments?clinicId=${user.clinicId}`, { headers }),
          fetch(`${API_URL}/users?role=patient`, { headers }),
        ]);

        console.log("Clinic response status:", clinicRes.status);

        if (!clinicRes.ok) {
          throw new Error(`Failed to fetch clinic. Status: ${clinicRes.status}`);
        }

        const clinicData = await clinicRes.json();
        const appts = await apptRes.json();
        const patients = await patientRes.json();

        const map = {};
        patients.forEach((p) => (map[p.id] = p));
        setPatientsMap(map);

        setClinic(clinicData);
        setAppointments(appts);
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert(`Failed to load clinic dashboard: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [user, token]);

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

  return (
    <ClinicDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {clinic.name}</h1>
        {/* Example stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ClinicStatCard
            title="Total Patients"
            value={new Set(appointments.map(a => a.patientId)).size}
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

        {/* Example appointments */}
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          appointments.map((appt) => (
            <ClinicAppointmentRow
              key={appt.id}
              patientName={patientsMap[appt.patientId]?.fullName || "Unknown"}
              initial={patientsMap[appt.patientId]?.fullName?.[0] || "?"}
              service={appt.service || "N/A"}
              time={appt.time || "N/A"}
              status={appt.status}
              isToday={appt.date === new Date().toISOString().split("T")[0]}
              onComplete={() => console.log("Complete", appt.id)}
              onCancel={() => console.log("Cancel", appt.id)}
              onReschedule={() => console.log("Reschedule", appt.id)}
            />
          ))
        )}
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicDashboard;
