// src/pages/Checkups.jsx
import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { Calendar, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CheckupItem = ({ title, date, status, clinic, onBook }) => {
  const isDone = status === "Completed";
  const isDue = new Date(date) < new Date() && !isDone;
  const Icon = isDone ? CheckCircle : isDue ? AlertCircle : Calendar;
  const color = isDone
    ? "text-green-600"
    : isDue
    ? "text-orange-600"
    : "text-blue-600";

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border hover:shadow-md">
      <div className="flex items-center gap-4">
        <Icon className={`w-6 h-6 ${color}`} />
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-500">
            {clinic} • {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isDone
              ? "bg-green-100 text-green-700"
              : isDue
              ? "bg-orange-100 text-orange-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isDone ? "Done" : isDue ? "Overdue" : "Upcoming"}
        </span>
        {isDue && (
          <button
            onClick={onBook}
            className="text-xs text-orange-600 hover:underline"
          >
            Rebook
          </button>
        )}
      </div>
    </div>
  );
};

export default function Checkups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clinicMap, setClinicMap] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/clinics")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const map = {};
        data.forEach((c) => (map[c.id] = c.name));
        setClinicMap(map);
      });
  }, []);

  const loadCheckups = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get("/appointments/", {
        params: { patientId: user.id },
      });
      const filtered = res.data
        .filter((a) => {
          const txt = `${a.service || ""} ${a.notes || ""}`.toLowerCase();
          return txt.includes("checkup") || txt.includes("screening");
        })
        .map((a) => ({
          id: a.id,
          title: a.service || "Check-up",
          date: a.date,
          status: a.status,
          clinic: clinicMap[a.clinicId] || "Unknown",
          clinicId: a.clinicId,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setCheckups(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, clinicMap]);

  useEffect(() => {
    loadCheckups();
  }, [loadCheckups]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Health Check-ups</h1>
            <p className="text-gray-600">Preventive care tracker</p>
          </div>
          <button
            onClick={() => navigate("/find-clinics")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-5 h-5" /> Book
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : checkups.length ? (
          <div className="space-y-4">
            {checkups.map((c) => (
              <CheckupItem
                key={c.id}
                {...c}
                onBook={() => navigate(`/booking/${c.clinicId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">No check-ups scheduled.</p>
            <button
              onClick={() => navigate("/find-clinics")}
              className="mt-4 text-green-600 hover:underline"
            >
              Schedule now
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
