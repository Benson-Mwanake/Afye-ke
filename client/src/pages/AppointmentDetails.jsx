// src/pages/AppointmentDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { BriefcaseMedical, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://127.0.0.1:5000";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id || !id) return;

    const controller = new AbortController();

    const loadAppointment = async () => {
      try {
        const apptRes = await fetch(`${API_URL}/appointments/${id}`, {
          signal: controller.signal,
        });
        if (!apptRes.ok) throw new Error("Appointment not found");
        const appt = await apptRes.json();

        if (appt.patientId !== parseInt(user.id)) {
          setError("Access denied.");
          return;
        }

        const clinicRes = await fetch(`${API_URL}/clinics/${appt.clinicId}`, {
          signal: controller.signal,
        });
        const clinicData = clinicRes.ok ? await clinicRes.json() : null;

        setAppointment(appt);
        setClinic(clinicData);
      } catch (err) {
        setError(err.message || "Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
    return () => controller.abort();
  }, [user, id]);

  const handleBack = () => {
    navigate("/appointments");
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!appointment)
    return <p className="text-center text-gray-500">No data.</p>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Appointment Details
        </h1>
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <BriefcaseMedical className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {clinic?.name || appointment.clinicName}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <p className="text-gray-600">
                {clinic?.location || "Location not available"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <p className="text-gray-600">{appointment.date}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-teal-600" />
              <p className="text-gray-600">{appointment.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Doctor:</p>
              <p className="text-gray-600">
                {appointment.doctor || "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Service:</p>
              <p className="text-gray-600">
                {appointment.service || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p
                className={`text-gray-600 font-medium ${
                  appointment.status === "Completed"
                    ? "text-green-600"
                    : appointment.status === "Cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {appointment.status}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleBack}
              className="text-white bg-gray-600 hover:bg-gray-700"
            >
              Back to Appointments
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
