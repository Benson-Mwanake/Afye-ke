// src/pages/BookingFormWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "../components/clinics/BookingForm";

const API_URL = "https://gadgetreview-5c3b.onrender.com";

export default function BookingFormWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await fetch(`${API_URL}/clinics/${id}`);
        if (res.ok) {
          const data = await res.json();
          setClinic(data);
        } else {
          // 404 → fallback
          setClinic({ id, name: "Unknown Clinic" });
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setClinic({ id, name: "Clinic Unavailable" });
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <p className="text-gray-600">Loading clinic...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
      >
        Back to Clinic
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Booking at <span className="text-green-600">{clinic.name}</span>
        </h2>

        <BookingForm clinicId={clinic.id} clinicName={clinic.name} />
      </div>
    </div>
  );
}
