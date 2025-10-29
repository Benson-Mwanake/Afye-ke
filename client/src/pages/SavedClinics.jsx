// src/pages/SavedClinics.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { MapPin, BookmarkCheck, Phone, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000";

const ClinicCard = ({ clinic, onUnsave }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{clinic.name}</h3>
        <BookmarkCheck className="w-5 h-5 text-green-600 fill-current" />
      </div>
      <p className="text-sm text-gray-600 mb-3">{clinic.location}</p>
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          {clinic.phone}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          {clinic.operatingHours}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => navigate(`/clinic/${clinic.id}`)}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          View Details
        </button>
        <button
          onClick={() => onUnsave(clinic.id)}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
        >
          Unsave
        </button>
      </div>
    </div>
  );
};

export default function SavedClinics() {
  const { user, loading: authLoading, toggleSavedClinic } = useAuth();
  const [saved, setSaved] = useState([]);
  const [fetching, setFetching] = useState(true);

  // -------------------------------------------------
  // Load saved clinics only when auth is ready
  // -------------------------------------------------
  useEffect(() => {
    if (authLoading || !user?.id) return;

    const ctrl = new AbortController();

    const load = async () => {
      try {
        const ids = user.savedClinics || [];
        if (!ids.length) {
          setSaved([]);
          return setFetching(false);
        }

        const clinics = await Promise.all(
          ids.map((id) =>
            fetch(`${API_URL}/clinics/${id}`, { signal: ctrl.signal }).then(
              (r) => (r.ok ? r.json() : null)
            )
          )
        );

        setSaved(clinics.filter(Boolean));
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };

    load();
    return () => ctrl.abort();
  }, [user, authLoading]);

  // -------------------------------------------------
  // Unsave handler – UI + server in one call
  // -------------------------------------------------
  const handleUnsave = (clinicId) => {
    toggleSavedClinic(clinicId);
    setSaved((prev) => prev.filter((c) => c.id !== clinicId));
  };

  // -------------------------------------------------
  // Auth loading guard
  // -------------------------------------------------
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 text-center">
          <p className="text-gray-500">Loading user…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 text-center">
          <p className="text-gray-700">Please log in to view saved clinics.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 text-green-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Clinics</h1>
        <p className="text-gray-600 mb-8">
          Clinics you’ve starred for quick access.
        </p>

        {fetching ? (
          <p className="text-center text-gray-500">Loading saved clinics…</p>
        ) : saved.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No saved clinics yet.</p>
            <button
              onClick={() => (window.location.href = "/find-clinics")}
              className="mt-4 text-green-600 hover:underline"
            >
              Browse clinics
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((c) => (
              <ClinicCard key={c.id} clinic={c} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
