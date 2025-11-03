// src/pages/clinic/ClinicSchedule.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const ClinicSchedule = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppts = async () => {
      if (!user?.clinicId) return;
      const res = await fetch(
        `http://127.0.0.1:5000/appointments?clinicId=${user.clinicId}`
      );
      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    };
    fetchAppts();
  }, [user]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getApptsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(
      (a) => a.date === dateStr && a.status !== "Cancelled"
    );
  };

  if (loading)
    return <div className="p-8 text-center">Loading schedule...</div>;

    return (
    <ClinicDashboardLayout>
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Schedule
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const appts = getApptsForDate(day);
            return (
              <div
                key={day}
                className={`h-24 p-2 rounded-lg border ${
                  appts.length > 0
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200"
                } hover:shadow-md transition cursor-pointer`}
              >
                <div className="font-semibold text-gray-800">{day}</div>
                {appts.length > 0 && (
                  <div className="text-xs text-green-700 mt-1">
                    {appts.length} appt{appts.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
            </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicSchedule;
