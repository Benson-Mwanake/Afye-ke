import React, { useEffect, useState } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { MapPin, Star, Phone, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClinicCard = ({ clinic }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{clinic.name}</h3>
        <Star className="w-5 h-5 text-yellow-500 fill-current" />
      </div>
      <p className="text-sm text-gray-600 mb-3">{clinic.location}</p>

      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          {clinic.contact}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          {clinic.hours}
        </div>
      </div>

      <button
        onClick={() => navigate(`/clinic/${clinic.id}`)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
      >
        View Details
      </button>
    </div>
  );
};

export default function SavedClinics() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedClinics") || "[]");
    setSaved(data);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Clinics</h1>
        <p className="text-gray-600 mb-8">
          Clinics you’ve starred for quick access.
        </p>

        {saved.length === 0 ? (
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
              <ClinicCard key={c.id} clinic={c} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
