// src/pages/AppointmentDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { BriefcaseMedical, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    service: "",
    doctor: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (!user?.id || !id) return;

    const load = async () => {
      try {
        setLoading(true);

        // 1. Get appointment
        const apptRes = await api.get(`/appointments/${id}`);
        const appt = apptRes.data;
        if (appt.patientId !== user.id) {
          setError("Access denied.");
          return;
        }

        // 2. Get clinic
        const clinicRes = await api.get(`/clinics/${appt.clinicId}`);
        const clinicData = clinicRes.data;

        // 3. Get doctors
        let doctorList = [];
        try {
          const docRes = await api.get("/users/", {
            params: { role: "doctor", clinicId: clinicData.id },
          });
          doctorList = docRes.data;
        } catch (err) {
          console.warn("No doctors found for clinic:", err);
        }

        setAppointment(appt);
        setClinic(clinicData);
        setServices(clinicData.services || []);
        setDoctors(doctorList);
        setForm({
          service: appt.service || "",
          doctor: appt.doctor || "",
          date: appt.date || "",
          time: appt.time || "",
        });
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, id]);

  const handleUpdate = async () => {
    if (!form.service || !form.doctor || !form.date || !form.time) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await api.patch(`/appointments/${appointment.id}`, form);
      setAppointment(res.data);
      setIsEditing(false);
      alert("Updated!");
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Appointment Details</h1>
        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BriefcaseMedical className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">{clinic?.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <p>{clinic?.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <p>{appointment.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-teal-600" />
              <p>{appointment.time}</p>
            </div>
            <p>
              <strong>Doctor:</strong> {appointment.doctor || "Not assigned"}
            </p>
            <p>
              <strong>Service:</strong> {appointment.service}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  appointment.status === "Completed"
                    ? "text-green-600"
                    : appointment.status === "Cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                }
              >
                {appointment.status}
              </span>
            </p>
          </div>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-600 text-white"
            >
              Edit Appointment
            </Button>
          ) : (
            <div className="mt-6 space-y-4">
              <select
                name="service"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select service</option>
                {services.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                name="doctor"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Choose doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.full_name}>
                    {d.full_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={() => navigate("/appointments")}
            className="mt-4 bg-gray-600 text-white"
          >
            Back
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
