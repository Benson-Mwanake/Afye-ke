// src/pages/ClinicProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "https://afya-ke.onrender.com";

const to12h = (t) => {
  if (!t || t === "Closed") return "Closed";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h12}:${m} ${period}`;
};

const EditableField = ({ label, value, onChange, readOnly = false }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      className={`w-full p-3 rounded-lg border text-gray-800 transition-all duration-200
        ${
          readOnly
            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
            : "bg-white border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
    />
  </div>
);

const OperatingHoursEditor = ({ values, setFieldValue, isEditable }) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const toggleDay = (day) => {
    const cur = values.operatingHours[day];
    setFieldValue(`operatingHours.${day}`, {
      isClosed: !cur.isClosed,
      open: !cur.isClosed ? "" : "09:00",
      close: !cur.isClosed ? "" : "17:00",
    });
  };

  const setTime = (day, type, val) => {
    setFieldValue(`operatingHours.${day}.${type}`, val);
  };

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const slot = values.operatingHours[day] || {
          isClosed: true,
          open: "",
          close: "",
        };
        const label = day.charAt(0).toUpperCase() + day.slice(1);
        return (
          <div
            key={day}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="text-base font-medium text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">
              {label}
            </div>

            {!isEditable ? (
              <div className="w-full sm:w-2/3">
                {slot.isClosed ? (
                  <span className="text-red-500 font-semibold">Closed</span>
                ) : (
                  <span className="font-medium text-gray-800">
                    {to12h(slot.open)} – {to12h(slot.close)}
                  </span>
                )}
              </div>
            ) : !slot.isClosed ? (
              <div className="flex space-x-3 w-full sm:w-2/3 items-center">
                <input
                  type="time"
                  value={slot.open}
                  onChange={(e) => setTime(day, "open", e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-gray-300"
                />
                <input
                  type="time"
                  value={slot.close}
                  onChange={(e) => setTime(day, "close", e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  {slot.isClosed ? "Open" : "Close"}
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full sm:w-2/3">
                <span className="text-red-500 font-semibold">Closed</span>
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="text-green-600 text-sm hover:text-green-700"
                >
                  Open
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ClinicProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [clinic, setClinic] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState(null);

  const servicesList = [
    { key: "generalPractice", label: "General Practice" },
    { key: "laboratoryServices", label: "Laboratory Services" },
    { key: "dentalCare", label: "Dental Care" },
    { key: "xRay", label: "X-Ray" },
    { key: "surgery", label: "Surgery" },
    { key: "physiotherapy", label: "Physiotherapy" },
    { key: "pediatrics", label: "Pediatrics" },
    { key: "pharmacy", label: "Pharmacy" },
    { key: "maternity", label: "Maternity" },
    { key: "immunization", label: "Immunization" },
    { key: "emergencyServices", label: "Emergency Services" },
    { key: "mentalHealth", label: "Mental Health" },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      phone: "",
      email: "",
      website: "",
      county: "",
      areaTown: "",
      fullAddress: "",
      operatingHours: {
        monday: { isClosed: true, open: "", close: "" },
        tuesday: { isClosed: true, open: "", close: "" },
        wednesday: { isClosed: true, open: "", close: "" },
        thursday: { isClosed: true, open: "", close: "" },
        friday: { isClosed: true, open: "", close: "" },
        saturday: { isClosed: true, open: "", close: "" },
        sunday: { isClosed: true, open: "", close: "" },
      },
      services: Object.fromEntries(servicesList.map((s) => [s.key, false])),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Clinic name is required"),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      county: Yup.string().required("County is required"),
      fullAddress: Yup.string().required("Full address is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError(null);
        const oh = Object.entries(values.operatingHours).map(([day, slot]) =>
          slot.isClosed
            ? {
                day: day.charAt(0).toUpperCase() + day.slice(1),
                open: null,
                close: null,
                closed: true,
              }
            : {
                day: day.charAt(0).toUpperCase() + day.slice(1),
                open: slot.open,
                close: slot.close,
                closed: false,
              }
        );

        const services = Object.entries(values.services)
          .filter(([, v]) => v)
          .map(([k]) => servicesList.find((s) => s.key === k)?.label);

        const payload = {
          name: values.name,
          description: values.description,
          phone: values.phone,
          email: values.email,
          website: values.website,
          county: values.county,
          area_town: values.areaTown,
          full_address: values.fullAddress,
          operating_hours: oh,
          services,
          images,
        };

        console.log("Submitting payload:", payload);

        const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to save profile");
        }

        const saved = await res.json();
        console.log("Saved data:", saved);

        // Sync form with saved data
        const ohMap = {
          monday: { isClosed: true, open: "", close: "" },
          tuesday: { isClosed: true, open: "", close: "" },
          wednesday: { isClosed: true, open: "", close: "" },
          thursday: { isClosed: true, open: "", close: "" },
          friday: { isClosed: true, open: "", close: "" },
          saturday: { isClosed: true, open: "", close: "" },
          sunday: { isClosed: true, open: "", close: "" },
        };
        saved.operating_hours?.forEach((slot) => {
          const key = slot.day.toLowerCase();
          if (ohMap[key])
            ohMap[key] = {
              open: slot.open,
              close: slot.close,
              isClosed: slot.closed,
            };
        });
        const servicesMap = Object.fromEntries(
          servicesList.map((s) => [
            s.key,
            saved.services?.includes(s.label) ?? false,
          ])
        );

        formik.setValues({
          name: saved.name,
          description: saved.description || "",
          phone: saved.phone || "",
          email: saved.email || "",
          website: saved.website || "",
          county: saved.county || "",
          areaTown: saved.area_town || "",
          fullAddress: saved.full_address || "",
          operatingHours: ohMap,
          services: servicesMap,
        });
        setClinic(saved);
        setImages(saved.images || []);
        setIsEditable(false);
        alert("Profile saved successfully!");
      } catch (err) {
        console.error("Save error:", err);
        setError(`Failed to save profile: ${err.message}`);
        alert(`Failed to save profile: ${err.message}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.clinicId || !token) {
        setError("Not authenticated or no clinic associated");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Clinic not found");
        }
        const data = await res.json();
        console.log("Loaded clinic:", data);

        const ohMap = {
          monday: { isClosed: true, open: "", close: "" },
          tuesday: { isClosed: true, open: "", close: "" },
          wednesday: { isClosed: true, open: "", close: "" },
          thursday: { isClosed: true, open: "", close: "" },
          friday: { isClosed: true, open: "", close: "" },
          saturday: { isClosed: true, open: "", close: "" },
          sunday: { isClosed: true, open: "", close: "" },
        };
        data.operating_hours?.forEach((slot) => {
          const key = slot.day.toLowerCase();
          if (ohMap[key])
            ohMap[key] = {
              open: slot.open,
              close: slot.close,
              isClosed: slot.closed,
            };
        });

        const services = Object.fromEntries(
          servicesList.map((s) => [
            s.key,
            data.services?.includes(s.label) ?? false,
          ])
        );

        formik.setValues({
          name: data.name,
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          county: data.county || "",
          areaTown: data.area_town || "",
          fullAddress: data.full_address || "",
          operatingHours: ohMap,
          services,
        });
        setClinic(data);
        setImages(data.images || []);
      } catch (e) {
        console.error("Load error:", e);
        setError(`Failed to load clinic profile: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, token]);

  const handleImageFiles = async (files) => {
    if (images.length + files.length > 5)
      return alert("Maximum 5 images allowed");
    setUploading(true);
    try {
      const newImages = await Promise.all(
        files
          .filter((f) => f.type.startsWith("image/"))
          .map(
            (f) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(f);
              })
          )
      );
      const updated = [...images, ...newImages];
      setImages(updated);
      const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ images: updated }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload images");
      }
      const saved = await res.json();
      setImages(saved.images || []);
    } catch (e) {
      console.error("Image upload error:", e);
      setError(`Failed to upload images: ${e.message}`);
      alert(`Failed to upload images: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    try {
      const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ images: updated }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to remove image");
      }
      const saved = await res.json();
      setImages(saved.images || []);
    } catch (e) {
      console.error("Image remove error:", e);
      setError(`Failed to remove image: ${e.message}`);
      alert(`Failed to remove image: ${e.message}`);
    }
  };

  if (loading)
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-12">Loading clinic profile…</div>
      </ClinicDashboardLayout>
    );

  if (error || !clinic)
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-12 text-red-600">
          {error || "Clinic not found – please log in as a clinic."}
          <p className="text-sm mt-2">
            Ensure the backend is running on <code>{API_URL}</code>
          </p>
        </div>
      </ClinicDashboardLayout>
    );

  return (
    <ClinicDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Clinic Profile</h1>
          <button
            onClick={() => {
              setError(null);
              setIsEditable(!isEditable);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEditable ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {[
            "name",
            "description",
            "phone",
            "email",
            "website",
            "county",
            "areaTown",
            "fullAddress",
          ].map((f) => (
            <EditableField
              key={f}
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              value={formik.values[f]}
              onChange={(v) => formik.setFieldValue(f, v)}
              readOnly={!isEditable}
            />
          ))}

          <div>
            <h2 className="text-lg font-medium mb-2">Operating Hours</h2>
            <OperatingHoursEditor
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              isEditable={isEditable}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {servicesList.map((s) => (
                <label key={s.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formik.values.services[s.key]}
                    disabled={!isEditable}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `services.${s.key}`,
                        e.target.checked
                      )
                    }
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {isEditable && (
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                formik.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {formik.isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>

        <div>
          <h2 className="text-lg font-medium mb-2">Images</h2>
          <div
            onDrop={(e) => {
              e.preventDefault();
              if (isEditable)
                handleImageFiles(Array.from(e.dataTransfer.files));
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border border-dashed border-gray-300 p-4 rounded-lg flex flex-wrap gap-3"
          >
            {images.map((img, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={img}
                  alt={`clinic-${idx}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            {isEditable && images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500"
              >
                <Upload className="w-6 h-6" />
              </button>
            )}
          </div>
          {isEditable && (
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={(e) => handleImageFiles(Array.from(e.target.files))}
              className="hidden"
            />
          )}
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicProfile;
