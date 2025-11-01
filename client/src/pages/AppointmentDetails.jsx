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

  // --- New state for services, doctors, editing ---
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    service: "",
    doctor: "",
    date: "",
    time: "",
  });

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

        // Initialize form for editing
        setForm({
          service: appt.service || "",
          doctor: appt.doctor || "",
          date: appt.date || "",
          time: appt.time || "",
        });

        // Load services and doctors dynamically
        if (clinicData) {
          setServices(clinicData.services || []);
          const docRes = await fetch(`${API_URL}/users?role=doctor&clinicId=${clinicData.id}`);
          const docData = docRes.ok ? await docRes.json() : [];
          setDoctors(docData);
        }
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.service || !form.doctor || !form.date || !form.time) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      const updated = await res.json();
      setAppointment(updated);
      setIsEditing(false);
      alert("Appointment updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment");
    }
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

          {/* Edit / Reschedule Form */}
          <div className="mt-6">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="text-white bg-blue-600 hover:bg-blue-700 mr-2"
              >
                Edit Appointment
              </Button>
            )}

            {isEditing && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select service</option>
                    {services.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Doctor
                  </label>
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.fullName}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button
                    onClick={handleUpdate}
                    className="text-white bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="text-white bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
