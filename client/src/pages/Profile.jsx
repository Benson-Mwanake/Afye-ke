// src/pages/PatientProfile.jsx
import React, { useState, useEffect } from "react";
import { Calendar, ClipboardList, Pencil, Save, XCircle } from "lucide-react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000";

// Reusable input field
const EditableField = ({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  placeholder = "",
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full p-3 rounded-lg border text-gray-800 transition-all duration-200
        ${
          readOnly
            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
            : "bg-white border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
    />
  </div>
);

// Appointment row
const AppointmentHistoryRow = ({ clinic, doctor, service, date, status }) => (
  <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 last:border-b-0">
    <div className="flex items-start space-x-4">
      <ClipboardList className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-800">{clinic}</h4>
        <p className="text-sm text-gray-600">
          {doctor} • {service}
        </p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full mt-3 sm:mt-0
        ${
          status === "Confirmed"
            ? "text-blue-700 bg-blue-100"
            : status === "Completed"
            ? "text-green-700 bg-green-100"
            : status === "Cancelled"
            ? "text-red-700 bg-red-100"
            : "text-gray-700 bg-gray-100"
        }`}
    >
      {status}
    </span>
  </div>
);

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState({});
  const [loading, setLoading] = useState(true);
  const [apptLoading, setApptLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile + clinics map
  useEffect(() => {
    if (!user?.id || user.role !== "patient") {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfileAndClinics = async () => {
      try {
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          dob: user.profile?.dob || "",
          gender: user.profile?.gender || "",
          country: user.profile?.country || "",
          bloodType: user.profile?.bloodType || "Unknown",
          allergies: user.profile?.allergies || "",
          emergencyContact: user.profile?.emergencyContact || "",
        });

        // Fetch clinics map
        const clinicsRes = await fetch(`${API_URL}/clinics`, {
          signal: controller.signal,
        });
        if (!clinicsRes.ok) throw new Error("Failed to load clinics");
        const clinicsData = await clinicsRes.json();
        const map = {};
        clinicsData.forEach((c) => (map[c.id] = c.name));
        setClinics(map);

        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Profile load error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndClinics();
    return () => controller.abort();
  }, [user]);

  // Load ALL appointments (Confirmed + Completed + Pending)
  useEffect(() => {
    if (!user?.id || user.role !== "patient") {
      setApptLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${API_URL}/appointments?patientId=${user.id}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          console.error("Failed to load appointments:", res.status);
          return;
        }
        const data = await res.json();

        // SHOW ALL: Confirmed + Completed + Pending + Cancelled
        const allAppointments = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAppointments(allAppointments);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Appointments fetch error:", err);
        }
      } finally {
        setApptLoading(false);
      }
    };

    fetchAppointments();
    return () => controller.abort();
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const updated = {
      fullName: formData.fullName,
      phoneNumber: formData.phone,
      profile: {
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country,
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        emergencyContact: formData.emergencyContact,
      },
    };

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Is json-server running?");
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      dob: user?.profile?.dob || "",
      gender: user?.profile?.gender || "",
      country: user?.profile?.country || "",
      bloodType: user?.profile?.bloodType || "Unknown",
      allergies: user?.profile?.allergies || "",
      emergencyContact: user?.profile?.emergencyContact || "",
    });
    setIsEditing(false);
  };

  if (!user || user.role !== "patient") {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-gray-600">
          Only patients can view this profile.
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-gray-600">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Make sure <code>json-server</code> is running on{" "}
            <code>http://localhost:4000</code>
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const initials = formData.fullName
    ? formData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 transition"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-600 text-white font-bold text-4xl rounded-full flex items-center justify-center mb-4 shadow-lg">
              {initials}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {formData.fullName || "Unknown User"}
            </h3>
            <p className="text-base text-gray-500 mb-6">{formData.email}</p>

            <div className="w-full space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Member Since
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  Jan 2023
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Visits
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {appointments.length} visits
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Blood Type
                </span>
                <span className="text-sm font-semibold px-3 py-0.5 rounded-full text-red-700 bg-red-100">
                  {formData.bloodType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form + Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Full Name"
                value={formData.fullName}
                onChange={(v) => handleChange("fullName", v)}
                readOnly={!isEditing}
              />
              <EditableField
                label="Email Address"
                value={formData.email}
                type="email"
                readOnly={true}
              />
              <EditableField
                label="Phone Number"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
                readOnly={!isEditing}
              />
              <EditableField
                label="Date of Birth"
                value={formData.dob}
                type="date"
                onChange={(v) => handleChange("dob", v)}
                readOnly={!isEditing}
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-lg border text-gray-800 ${
                    !isEditing
                      ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                      : "bg-white border-blue-400"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <EditableField
                label="Country/Region"
                value={formData.country}
                onChange={(v) => handleChange("country", v)}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Medical Info */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Blood Type"
                value={formData.bloodType}
                readOnly={true}
              />
              <EditableField
                label="Allergies"
                value={formData.allergies}
                onChange={(v) => handleChange("allergies", v)}
                readOnly={!isEditing}
                placeholder="e.g. Penicillin, Nuts"
              />
              <div className="md:col-span-2">
                <EditableField
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={(v) => handleChange("emergencyContact", v)}
                  readOnly={!isEditing}
                  placeholder="Name • Phone"
                />
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Appointment History
            </h2>
            <div className="divide-y divide-gray-100">
              {apptLoading ? (
                <p className="text-gray-500 py-4">Loading appointments...</p>
              ) : appointments.length > 0 ? (
                appointments
                  .slice(0, 5)
                  .map((appt) => (
                    <AppointmentHistoryRow
                      key={appt.id}
                      clinic={
                        clinics[appt.clinicId] ||
                        appt.clinicName ||
                        "Unknown Clinic"
                      }
                      doctor={appt.doctor || "Dr. Not Assigned"}
                      service={appt.service || "General"}
                      date={appt.date}
                      status={appt.status}
                    />
                  ))
              ) : (
                <p className="text-gray-500 py-4">No appointments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
