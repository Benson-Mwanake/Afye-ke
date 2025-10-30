import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  BookOpen,
  Heart,
  BriefcaseMedical,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [clinicsMap, setClinicsMap] = useState({});

  // ✅ Centralized function to load appointments & stats
  const loadAppointments = async () => {
    try {
      const res = await api.get(`/appointments?patientId=${user.id}`);
      const allAppts = res.data;
      const upcoming = allAppts.filter(a =>
        ["Confirmed", "Pending", "Scheduled"].includes(a.status)
      );
      const checkups = allAppts.filter(
        a =>
          a.status === "Completed" &&
          (a.service?.toLowerCase().includes("checkup") ||
            a.notes?.toLowerCase().includes("checkup"))
      );

      setUpcomingAppointments(upcoming.slice(0, 3));

      setStats(prev =>
        prev.map(s =>
          s.title === "Upcoming Appointments"
            ? {
                ...s,
                value: upcoming.length,
                trend: upcoming.length ? `${upcoming.length} upcoming` : "No upcoming",
              }
            : s
        )
      );

      return { upcoming, checkups };
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  // Fetch stats & appointments
  useEffect(() => {
    if (!user?.id) return;

    const ctrl = new AbortController();

    const fetchData = async () => {
      try {
        // Appointments
        const { checkups } = await loadAppointments();

        // Articles
        const artRes = await api.get("/articles", { signal: ctrl.signal });
        const published = artRes.data.filter(a => a.published).length;

        // Clinics
        const clinRes = await api.get("/clinics", { signal: ctrl.signal });
        const map = {};
        clinRes.data.forEach(c => (map[c.id] = c.name));
        setClinicsMap(map);

        // Stats
        setStats(prev => [
          {
            title: "Upcoming Appointments",
            value: prev.find(s => s.title === "Upcoming Appointments")?.value || 0,
            icon: Calendar,
            color: "green",
            trend:
              prev.find(s => s.title === "Upcoming Appointments")?.trend ||
              "No upcoming",
          },
          {
            title: "Saved Clinics",
            value: user.savedClinics?.length || 0,
            icon: MapPin,
            color: "blue",
            trend: user.savedClinics?.length
              ? `${user.savedClinics.length} saved`
              : "None saved",
          },
          {
            title: "Articles Read",
            value: published,
            icon: BookOpen,
            color: "dark-green",
            trend: "Stay informed!",
          },
          {
            title: "Health Checkups",
            value: checkups.length,
            icon: Heart,
            color: "light-blue",
            trend: checkups.length ? `${checkups.length} this year` : "Due soon",
          },
        ]);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => {
      ctrl.abort();
      clearInterval(interval);
    };
  }, [user]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}`, { status: "Cancelled" });
      await loadAppointments(); // ✅ Refresh appointments & stats
      alert("Cancelled");
    } catch {
      alert("Failed");
    }
  };

  // Loading state
  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-gray-600">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  // UI Components
  const PatientStatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
      green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
      blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
      "dark-green": { bg: "bg-teal-600", text: "text-white", trend: "text-teal-200" },
      "light-blue": { bg: "bg-blue-600", text: "text-white", trend: "text-blue-200" },
    };
    const { bg, text, trend: trendColor } = colors[color] || colors.green;
    return (
      <div className={`${bg} p-6 rounded-xl shadow-lg flex flex-col justify-between h-full`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>{title}</h3>
          <div className="p-2 rounded-full bg-white bg-opacity-20">
            <Icon className={`w-6 h-6 ${text}`} />
          </div>
        </div>
        <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>{value}</p>
        <p className={`mt-2 text-sm ${trendColor} font-medium`}>{trend}</p>
      </div>
    );
  };

  const AppointmentRow = ({ appt }) => (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-start space-x-4">
        <BriefcaseMedical className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">{clinicsMap[appt.clinicId] || "Clinic"}</h4>
          <p className="text-sm text-gray-600"> {appt.doctorName} • {appt.service} </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" /> {appt.date} @ {appt.time}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0">
        <button
          onClick={() => navigate(`/appointment/${appt.id}`)}
          className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
        >
          Details
        </button>
        <button
          onClick={() => handleCancelAppointment(appt.id)}
          className="text-sm font-medium text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/*  Welcome message */}
      <div className="mb-6 text-lg font-semibold text-gray-700">
        Welcome back, {user.fullName}!
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <PatientStatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        {upcomingAppointments.length ? (
          upcomingAppointments.map(a => <AppointmentRow key={a.id} appt={a} />)
        ) : (
          <p className="text-gray-500">No upcoming appointments</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
