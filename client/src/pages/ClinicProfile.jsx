// src/pages/ClinicProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, Mail, Trash2, Edit2, Save, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://localhost:4000";

/* ────────────────────── Helpers ────────────────────── */
const to12h = (t) => {
  if (!t || t === "Closed") return "Closed";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h12}:${m} ${period}`;
};

/* ────────────────────── Reusable Editable Field ────────────────────── */
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

/* ────────────────────── Operating Hours ────────────────────── */
const OperatingHoursEditor = ({ values, setFieldValue, isEditable }) => {
  const days = [
    { key: "mondayFriday", label: "Monday – Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
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
      {days.map(({ key, label }) => {
        const slot = values.operatingHours[key] || {
          isClosed: true,
          open: "",
          close: "",
        };
        return (
          <div
            key={key}
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
              <div className="flex space-x-3 w-full sm:w-2/3">
                <input
                  type="time"
                  value={slot.open}
                  onChange={(e) => setTime(key, "open", e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-gray-300"
                />
                <input
                  type="time"
                  value={slot.close}
                  onChange={(e) => setTime(key, "close", e.target.value)}
                  className="w-1/2 p-2 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => toggleDay(key)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full sm:w-2/3">
                <span className="text-red-500 font-semibold">Closed</span>
                <button
                  type="button"
                  onClick={() => toggleDay(key)}
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

/* ────────────────────── Main Component ────────────────────── */
const ClinicProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [clinic, setClinic] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // ─── Formik ───
  const formik = useFormik({
    enableReinitialize: true, // <-- crucial: re-populate when clinic loads
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
        mondayFriday: { isClosed: true, open: "", close: "" },
        saturday: { isClosed: true, open: "", close: "" },
        sunday: { isClosed: true, open: "", close: "" },
      },
      services: {
        generalPractice: false,
        laboratoryServices: false,
        dentalCare: false,
        xRay: false,
        surgery: false,
        physiotherapy: false,
        pediatrics: false,
        pharmacy: false,
        maternity: false,
        immunization: false,
        emergencyServices: false,
        mentalHealth: false,
      },
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
        const oh = [];

        // Mon-Fri
        const mf = values.operatingHours.mondayFriday;
        if (mf && !mf.isClosed) {
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(
            (d) =>
              oh.push({ day: d, open: mf.open, close: mf.close, closed: false })
          );
        } else {
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(
            (d) => oh.push({ day: d, open: null, close: null, closed: true })
          );
        }

        // Sat & Sun
        ["saturday", "sunday"].forEach((key) => {
          const slot = values.operatingHours[key];
          const dayName = key.charAt(0).toUpperCase() + key.slice(1);
          oh.push(
            slot && !slot.isClosed
              ? {
                  day: dayName,
                  open: slot.open,
                  close: slot.close,
                  closed: false,
                }
              : { day: dayName, open: null, close: null, closed: true }
          );
        });

        const services = Object.entries(values.services)
          .filter(([, v]) => v)
          .map(([k]) => {
            const map = {
              generalPractice: "General Checkup",
              laboratoryServices: "Lab Tests",
              dentalCare: "Dental",
              xRay: "X-Ray",
              surgery: "Surgery",
              physiotherapy: "Physiotherapy",
              pediatrics: "Pediatrics",
              pharmacy: "Pharmacy",
              maternity: "Maternity",
              immunization: "Vaccinations",
              emergencyServices: "Emergency",
            };
            return map[k] || "";
          })
          .filter(Boolean);

        const payload = {
          name: values.name,
          description: values.description,
          phone: values.phone,
          email: values.email,
          website: values.website,
          county: values.county,
          areaTown: values.areaTown,
          fullAddress: values.fullAddress,
          operatingHours: oh,
          services,
        };

        const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Save failed");
        const saved = await res.json();
        setClinic({ ...clinic, ...saved });
        setIsEditable(false);
        alert("Profile saved successfully!");
      } catch (e) {
        console.error(e);
        alert("Failed to save profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ─── Load Clinic ───
  useEffect(() => {
    const load = async () => {
      if (!user?.clinicId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/clinics/${user.clinicId}`);
        if (!res.ok) throw new Error("Clinic not found");
        const data = await res.json();

        const ohMap = {
          mondayFriday: { isClosed: true, open: "", close: "" },
          saturday: { isClosed: true, open: "", close: "" },
          sunday: { isClosed: true, open: "", close: "" },
        };

        data.operatingHours?.forEach((slot) => {
          if (
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
              slot.day
            )
          ) {
            ohMap.mondayFriday = {
              open: slot.open,
              close: slot.close,
              isClosed: slot.closed,
            };
          } else if (slot.day === "Saturday") {
            ohMap.saturday = {
              open: slot.open,
              close: slot.close,
              isClosed: slot.closed,
            };
          } else if (slot.day === "Sunday") {
            ohMap.sunday = {
              open: slot.open,
              close: slot.close,
              isClosed: slot.closed,
            };
          }
        });

        const services = {
          generalPractice: data.services?.includes("General Checkup") ?? false,
          laboratoryServices: data.services?.includes("Lab Tests") ?? false,
          dentalCare: data.services?.includes("Dental") ?? false,
          xRay: data.services?.includes("X-Ray") ?? false,
          surgery: data.services?.includes("Surgery") ?? false,
          physiotherapy: data.services?.includes("Physiotherapy") ?? false,
          pediatrics: data.services?.includes("Pediatrics") ?? false,
          pharmacy: data.services?.includes("Pharmacy") ?? false,
          maternity: data.services?.includes("Maternity") ?? false,
          immunization: data.services?.includes("Vaccinations") ?? false,
          emergencyServices: data.services?.includes("Emergency") ?? false,
          mentalHealth: false,
        };

        const formValues = {
          name: data.name || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          county: data.county || "",
          areaTown: data.areaTown || "",
          fullAddress: data.fullAddress || "",
          operatingHours: ohMap,
          services,
        };

        formik.setValues(formValues); // <-- populates form
        setClinic(data);
        setImages(data.images || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load clinic profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ─── Image Upload ───
  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageFiles(files);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
  };

  const handleImageFiles = async (files) => {
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setUploading(true);
    const newImages = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push(ev.target.result);
        if (newImages.length === files.length) {
          const updated = [...images, ...newImages];
          setImages(updated);
          fetch(`${API_URL}/clinics/${user.clinicId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: updated }),
          }).finally(() => setUploading(false));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = async (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    await fetch(`${API_URL}/clinics/${user.clinicId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: updated }),
    });
  };

  const servicesList = [
    { key: "generalPractice", label: "General Practice" },
    { key: "laboratoryServices", label: "Laboratory Services" },
    { key: "dentalCare", label: "Dental Care" },
    { key: "xRay", label: "X‑Ray" },
    { key: "surgery", label: "Surgery" },
    { key: "physiotherapy", label: "Physiotherapy" },
    { key: "pediatrics", label: "Pediatrics" },
    { key: "pharmacy", label: "Pharmacy" },
    { key: "maternity", label: "Maternity" },
    { key: "immunization", label: "Immunization" },
    { key: "emergencyServices", label: "Emergency Services" },
    { key: "mentalHealth", label: "Mental Health" },
  ];

  if (loading) {
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-12">Loading clinic profile…</div>
      </ClinicDashboardLayout>
    );
  }

  if (!clinic) {
    return (
      <ClinicDashboardLayout>
        <div className="text-center py-12 text-red-600">
          Clinic not found – please log in as a clinic.
        </div>
      </ClinicDashboardLayout>
    );
  }

  return (
    <ClinicDashboardLayout>
      <form onSubmit={formik.handleSubmit}>
        {/* ───── Header ───── */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditable ? "Edit Clinic Profile" : "Clinic Profile"}
            </h1>
            <p className="text-gray-500">
              {isEditable
                ? "Update your clinic details"
                : "View your clinic information"}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditable ? (
              <>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {formik.isSubmitting ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    formik.resetForm();
                    setIsEditable(false);
                  }}
                  className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 transition"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditable(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ───── Grid ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Clinic Name"
                  value={formik.values.name}
                  onChange={(v) => formik.setFieldValue("name", v)}
                  readOnly={!isEditable}
                />
                <EditableField
                  label="Email Address"
                  value={formik.values.email}
                  type="email"
                  readOnly={true}
                />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <textarea
                    value={formik.values.description}
                    onChange={(e) =>
                      formik.setFieldValue("description", e.target.value)
                    }
                    readOnly={!isEditable}
                    rows={3}
                    className={`w-full p-3 rounded-lg border text-gray-800 transition-all duration-200
                      ${
                        !isEditable
                          ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                          : "bg-white border-blue-400"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={(v) => formik.setFieldValue("phone", v)}
                  readOnly={!isEditable}
                />
                <EditableField
                  label="Website (Optional)"
                  value={formik.values.website}
                  onChange={(v) => formik.setFieldValue("website", v)}
                  readOnly={!isEditable}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="County"
                  value={formik.values.county}
                  onChange={(v) => formik.setFieldValue("county", v)}
                  readOnly={!isEditable}
                />
                <EditableField
                  label="Area / Town"
                  value={formik.values.areaTown}
                  onChange={(v) => formik.setFieldValue("areaTown", v)}
                  readOnly={!isEditable}
                />
                <div className="md:col-span-2">
                  <EditableField
                    label="Full Address"
                    value={formik.values.fullAddress}
                    onChange={(v) => formik.setFieldValue("fullAddress", v)}
                    readOnly={!isEditable}
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-3 border-gray-100">
                Operating Hours
              </h4>
              <OperatingHoursEditor
                values={formik.values}
                setFieldValue={formik.setFieldValue}
                isEditable={isEditable}
              />
            </div>

            {/* Services */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Services Offered
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {servicesList.map((s) => (
                  <div key={s.key} className="flex items-center">
                    <input
                      id={s.key}
                      type="checkbox"
                      checked={formik.values.services[s.key]}
                      onChange={() =>
                        formik.setFieldValue(
                          `services.${s.key}`,
                          !formik.values.services[s.key]
                        )
                      }
                      disabled={!isEditable}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor={s.key}
                      className={`ml-2 text-sm ${
                        !isEditable ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {s.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1 space-y-6">
            {/* Images */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Clinic Images
              </h2>
              {isEditable && (
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer"
                >
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    {uploading ? "Uploading..." : "Drop or click to upload"}
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG up to 5 MB • Max 5
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {images.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Clinic ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg shadow-sm"
                    />
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {images.length < 5 &&
                  Array(5 - images.length)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
                      />
                    ))}
              </div>
            </div>

            {/* Profile Status – NOW DYNAMIC */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
                Profile Status
              </h2>

              {/* Calculate completion */}
              {(() => {
                const fields = [
                  formik.values.name,
                  formik.values.phone,
                  formik.values.email,
                  formik.values.county,
                  formik.values.fullAddress,
                  formik.values.description,
                  images.length > 0,
                  Object.values(formik.values.services).some(Boolean),
                ];

                const filled = fields.filter(Boolean).length;
                const total = fields.length;
                const percentage = Math.round((filled / total) * 100);

                const missing = [];
                if (!formik.values.name) missing.push("Clinic name");
                if (!formik.values.phone) missing.push("Phone");
                if (!formik.values.email) missing.push("Email");
                if (!formik.values.county) missing.push("County");
                if (!formik.values.fullAddress) missing.push("Full address");
                if (!formik.values.description) missing.push("Description");
                if (images.length === 0)
                  missing.push(`Clinic photos (at least ${1 - images.length} needed)`);
                if (!Object.values(formik.values.services).some(Boolean))
                  missing.push("At least one service");

                // Optional: Add license check later
                // if (!clinic.licenses?.length) missing.push("Professional licenses");

                return (
                  <>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Profile Completion
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            percentage >= 80
                              ? "bg-green-600"
                              : percentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-right text-sm font-semibold text-gray-800 mt-1">
                        {percentage}%
                      </p>
                    </div>

                    {missing.length > 0 ? (
                      <div className="space-y-1 text-sm text-red-600">
                        <p className="font-medium">
                          Complete these to reach 100%:
                        </p>
                        <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
                          {missing.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-green-600">
                        Profile is 100% complete!
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Support */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Need Help?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance.
              </p>
              <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition">
                <Mail className="w-4 h-4 mr-2" /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </form>
    </ClinicDashboardLayout>
  );
};

export default ClinicProfile;
