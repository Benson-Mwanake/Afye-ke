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

const API_URL = "http://localhost:4000";

// ------------------------------------------------------------------
// 1. Stat Card
// ------------------------------------------------------------------
const ClinicStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
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
// 3. Operating Hours Component (Tailwind + Safe)
// ------------------------------------------------------------------
const OperatingHours = ({ hours }) => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });

  return (
    <div className="space-y-1.5">
      {hours.map((slot) => {
        const isToday = slot.day === today;
        const timeText = slot.closed
          ? "Closed"
          : `${slot.open} – ${slot.close}`;

        return (
          <div
            key={slot.day}
            className={`flex justify-between items-center py-1.5 px-2 rounded-md transition-all ${
              isToday
                ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            <span
              className={`text-sm ${
                isToday ? "text-blue-900" : "text-gray-700"
              }`}
            >
              {slot.day}
            </span>
            <span
              className={`text-sm font-medium ${
                slot.closed
                  ? "text-red-600"
                  : isToday
                  ? "text-blue-700"
                  : "text-gray-800"
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

  useEffect(() => {
    const loadData = async () => {
      if (!user?.clinicId) {
        setLoading(false);
        return;
      }

      try {
        const [clinicRes, apptRes, patientRes] = await Promise.all([
          fetch(`${API_URL}/clinics/${user.clinicId}`),
          fetch(`${API_URL}/appointments?clinicId=${user.clinicId}`),
          fetch(`${API_URL}/users?role=patient`),
        ]);

        if (!clinicRes.ok)
          throw new Error(`Clinic not found (ID: ${user.clinicId})`);

        const [clinicData, appts, patients] = await Promise.all([
          clinicRes.json(),
          apptRes.json(),
          patientRes.json(),
        ]);

        const map = {};
        patients.forEach((p) => (map[p.id] = p));
        setPatientsMap(map);

        setClinic(clinicData);
        setAppointments(appts);
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert(`Failed to load clinic: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, [user]);

  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const todayAppts = appointments
    .filter((a) => a.date === today && a.status !== "Cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppts = appointments
    .filter((a) => a.date > today && a.status !== "Cancelled")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5);

  const totalPatients = new Set(appointments.map((a) => a.patientId)).size;

  const thisWeekAppts = appointments.filter((a) => {
    const d = new Date(a.date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff)).toISOString().split("T")[0];
    return a.date >= monday && a.date <= today;
  }).length;

  // === RATING & REVIEWS ===
  const completedAppts = appointments.filter((a) => a.status === "Completed");
  const calculateRating = () => {
    if (completedAppts.length === 0) return { avg: "0.0", count: 0 };

    const fiveStar = Math.floor(completedAppts.length * 0.78);
    const fourStar = Math.floor(completedAppts.length * 0.17);
    const threeStar = completedAppts.length - fiveStar - fourStar;

    const total = fiveStar * 5 + fourStar * 4 + threeStar * 3;
    const avg = (total / completedAppts.length).toFixed(1);

    return { avg, count: completedAppts.length };
  };
  const { avg: avgRating, count: reviewCount } = calculateRating();

  // === ACTIONS ===
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

  // === AVERAGE WAIT TIME ===
  const averageWaitTime = (() => {
    const completedToday = todayAppts.filter((a) => a.status === "Completed");
    if (completedToday.length === 0) return "0m";

    const totalMinutes = completedToday.reduce((sum, a) => {
      const [h, m] = a.time.split(":").map(Number);
      const mins = h * 60 + m;
      return sum + mins;
    }, 0);

    const avgMins = Math.round(totalMinutes / completedToday.length);
    const hours = Math.floor(avgMins / 60);
    const mins = avgMins % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  })();

  // === RENDER ===
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Clinic Dashboard
        </h1>
        <p className="text-lg text-gray-600">Welcome back, {clinic.name}</p>
      </div>

      {/* Stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <ClinicStatCard
            title="Today's Appointments"
            value={todayAppts.length}
            icon={Calendar}
            color="green"
            trendValue={`${
              todayAppts.filter((a) => a.status === "Pending").length
            } pending`}
          />
          <ClinicStatCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            color="blue"
            trendValue="Unique patients seen"
          />
          <ClinicStatCard
            title="Appointments This Week"
            value={thisWeekAppts}
            icon={CheckCircle}
            color="dark-green"
            trendValue="On track"
          />
          <ClinicStatCard
            title="Avg Wait Time"
            value={averageWaitTime}
            icon={Clock3}
            color="light-blue"
            trendValue="Based on completed visits"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Today's Appointments
              </h2>
              <span className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1 rounded-full">
                {todayAppts.length} today
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {todayAppts.length > 0 ? (
                todayAppts.map((appt) => {
                  const patient = patientsMap[appt.patientId] || {};
                  return (
                    <ClinicAppointmentRow
                      key={appt.id}
                      patientName={patient.fullName || "Unknown Patient"}
                      initial={(patient.fullName || "?")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                      service={appt.service || "General"}
                      time={formatTime(appt.time)}
                      status={appt.status}
                      isToday={true}
                      onComplete={() => handleComplete(appt.id)}
                      onCancel={() => handleCancel(appt.id)}
                    />
                  );
                })
              ) : (
                <p className="text-gray-500 py-4">No appointments today.</p>
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h2>
              <button
                onClick={() => navigate("/clinic-schedule")}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingAppts.length > 0 ? (
                upcomingAppts.map((appt) => {
                  const patient = patientsMap[appt.patientId] || {};
                  return (
                    <ClinicAppointmentRow
                      key={appt.id}
                      patientName={patient.fullName || "Unknown"}
                      initial={(patient.fullName || "?")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                      service={appt.service}
                      time={`${appt.date
                        .split("-")
                        .slice(1)
                        .join("/")} @ ${formatTime(appt.time)}`}
                      status={appt.status}
                      isToday={false}
                      onReschedule={() =>
                        navigate(`/clinic-reschedule/${appt.id}`)
                      }
                    />
                  );
                })
              ) : (
                <p className="text-gray-500 py-4">No upcoming appointments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Clinic Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 text-white font-bold text-2xl rounded-full flex items-center justify-center mb-3">
              {clinic.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{clinic.name}</h3>
            <p className="text-sm text-gray-500 mb-4 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {clinic.location}
            </p>
            <button
              onClick={() => navigate("/clinic-profile")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>

            <div className="w-full pt-4 mt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-0.5 rounded-full">
                  Open
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-sm font-semibold text-gray-800">
                    {avgRating}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-sm font-semibold text-gray-800">
                  {reviewCount}
                </p>
              </div>
            </div>
          </div>

          {/* Operating Hours – FIXED */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Operating Hours
            </h4>
            <OperatingHours hours={clinic.operatingHours} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/clinic-availability")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <Clock className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-medium">Manage Appointments</span>
              </button>
              <button
                onClick={() => navigate("/clinic-patients")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <Users className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">View All Patients</span>
              </button>
              <button
                onClick={() => navigate("/clinic-analytics")}
                className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <BarChart2 className="w-5 h-5 mr-3 text-indigo-500" />
                <span className="font-medium">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicDashboard;
