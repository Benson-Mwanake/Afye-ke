// src/pages/PatientDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [clinicsMap, setClinicsMap] = useState({});
  const [stats, setStats] = useState([
    {
      title: "Upcoming Appointments",
      value: 0,
      icon: Calendar,
      color: "green",
      trend: "No upcoming",
    },
    {
      title: "Saved Clinics",
      value: 0,
      icon: MapPin,
      color: "blue",
      trend: "None saved",
    },
    {
      title: "Articles Read",
      value: 0,
      icon: BookOpen,
      color: "dark-green",
      trend: "Stay informed!",
    },
    {
      title: "Health Checkups",
      value: 0,
      icon: Heart,
      color: "light-blue",
      trend: "Due soon",
    },
  ]);

  // Helper: Parse date + time → Date object
  const parseApptDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Helper: Is appointment within 7 days?
  const isNearFuture = (dateTime) => {
    const now = new Date();
    const diffDays = (dateTime - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const loadAppointments = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await api.get("/appointments/", {
        params: { patientId: user.id },
      });
      const allAppts = res.data;

      // Filter: Active + Near future (≤7 days)
      const activeAppts = allAppts.filter((a) =>
        ["Confirmed", "Pending", "Scheduled"].includes(a.status)
      );

      const nearAppts = activeAppts
        .map((a) => ({
          ...a,
          dateTime: parseApptDateTime(a.date, a.time),
        }))
        .filter((a) => isNearFuture(a.dateTime))
        .sort((a, b) => a.dateTime - b.dateTime)
        .slice(0, 3); // Show only 3

      const checkups = allAppts.filter(
        (a) =>
          a.status === "Completed" &&
          (a.service?.toLowerCase().includes("checkup") ||
            a.notes?.toLowerCase().includes("checkup"))
      );

      setUpcomingAppointments(nearAppts);

      setStats((prev) =>
        prev.map((s) => {
          if (s.title === "Upcoming Appointments") {
            return {
              ...s,
              value: nearAppts.length,
              trend: nearAppts.length
                ? `${nearAppts.length} in next 7 days`
                : "No upcoming",
            };
          }
          if (s.title === "Health Checkups") {
            return {
              ...s,
              value: checkups.length,
              trend: checkups.length
                ? `${checkups.length} this year`
                : "Due soon",
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  }, [user]);

  // Load clinics + user stats
  useEffect(() => {
    if (!user?.id) return;

    const ctrl = new AbortController();

    const fetchData = async () => {
      try {
        await loadAppointments();

        const artRes = await api.get("/articles", { signal: ctrl.signal });
        const readCount = user.readArticles?.length || 0;

        const clinRes = await api.get("/clinics", { signal: ctrl.signal });
        const map = {};
        clinRes.data.forEach((c) => (map[c.id] = c.name));
        setClinicsMap(map);

        setStats((prev) =>
          prev.map((s) => {
            if (s.title === "Saved Clinics") {
              return {
                ...s,
                value: user.savedClinics?.length || 0,
                trend: user.savedClinics?.length
                  ? `${user.savedClinics.length} saved`
                  : "None saved",
              };
            }
            if (s.title === "Articles Read") {
              return {
                ...s,
                value: readCount,
                trend: readCount ? `${readCount} read` : "Stay informed!",
              };
            }
            return s;
          })
        );
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s

    return () => {
      ctrl.abort();
      clearInterval(interval);
    };
  }, [user, loadAppointments]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}`, { status: "Cancelled" });
      await loadAppointments();
      alert("Appointment cancelled");
    } catch {
      alert("Failed to cancel");
    }
  };

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-gray-600">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const PatientStatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
      green: {
        bg: "bg-green-600",
        text: "text-white",
        trend: "text-green-200",
      },
      blue: {
        bg: "bg-indigo-600",
        text: "text-white",
        trend: "text-indigo-200",
      },
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
    const { bg, text, trend: trendColor } = colors[color] || colors.green;

    return (
      <div
        className={`${bg} p-6 rounded-xl shadow-lg flex flex-col justify-between h-full text-left`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>
            {title}
          </h3>
          <div className="p-2 rounded-full bg-white bg-opacity-20">
            <Icon className={`w-6 h-6 ${text}`} />
          </div>
        </div>
        <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>
          {value}
        </p>
        <p className={`mt-2 text-sm ${trendColor} font-medium`}>{trend}</p>
      </div>
    );
  };

  const AppointmentRow = ({ appt }) => (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b last:border-0">
      <div className="flex items-start space-x-4">
        <BriefcaseMedical className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-gray-800">
            {clinicsMap[appt.clinicId] || "Clinic"}
          </h4>
          <p className="text-sm text-gray-600">
            {appt.doctor || "Dr. Not Assigned"} • {appt.service}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {appt.date} @ {appt.time}
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
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user.fullName || "Patient"}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here’s what’s happening with your health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <PatientStatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Upcoming Appointments (Next 7 Days)
          </h3>
          {upcomingAppointments.length > 0 && (
            <button
              onClick={() => navigate("/appointments")}
              className="text-sm text-green-600 hover:underline font-medium"
            >
              View All →
            </button>
          )}
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-2">
            {upcomingAppointments.map((a) => (
              <AppointmentRow key={a.id} appt={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No appointments in the next 7 days.</p>
            <button
              onClick={() => navigate("/clinic-browser")}
              className="mt-3 text-green-600 font-medium hover:underline"
            >
              Book an appointment
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
