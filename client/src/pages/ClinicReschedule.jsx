// src/pages/clinic/ClinicReschedule.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";
import api from "../services/api"; // ← YOUR AXIOS INSTANCE WITH JWT

const ClinicReschedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppt = async () => {
      try {
        // 1. Use api.get() → includes JWT
        const res = await api.get(`/appointments/${id}`);
        setAppt(res.data);
        setDate(res.data.date);
        setTime(res.data.time);
      } catch (err) {
        setError("Failed to load appointment");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppt();
  }, [id]);

  const handleSave = async () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      // 2. Use api.patch() → includes JWT
      await api.patch(`/appointments/${id}`, { date, time });
      alert("Rescheduled successfully!");
      navigate("/clinic-dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to reschedule");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <ClinicDashboardLayout>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Reschedule Appointment
        </h1>

        <div className="space-y-4">
          {/* 3. FIXED: Show patientName, not clinicName */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <p className="flex items-center text-gray-900">
              <User className="w-4 h-4 mr-2 text-green-600" />
              {appt.patientName || "Unknown Patient"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic
            </label>
            <p className="text-gray-900">{appt.clinicName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <p className="text-gray-900">{appt.service}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Date
            </label>
            <p className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {appt.date}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Time
            </label>
            <p className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {appt.time}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Save New Time
          </button>
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicReschedule;
