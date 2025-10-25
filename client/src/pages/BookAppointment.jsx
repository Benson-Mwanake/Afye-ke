import React from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Book a New Appointment
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a clinic and schedule your visit in a few clicks.
        </p>

        <button
          onClick={() => navigate("/find-clinics")}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
        >
          Find a Clinic
        </button>
      </div>
    </DashboardLayout>
  );
}
