// src/components/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api"; // use axios instance with interceptor

const API_URL = "http://127.0.0.1:5000"; // kept for clinic fetch fallback if needed

const bookingSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  service: Yup.string().required("Please select a service"),
  doctor: Yup.string().required("Please select a doctor"),
  date: Yup.date()
    .min(new Date().toISOString().split("T")[0], "Date cannot be in the past")
    .required("Date is required"),
  time: Yup.string().required("Time is required"),
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .required("Reason is required"),
});

export default function BookingForm({ clinicId: propClinicId, clinicName: propClinicName }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const clinicFromState = location.state?.clinic || {};

  // prefer props, fallback to navigation state
  const clinicId = Number(propClinicId ?? clinicFromState.id);
  const clinicName = propClinicName ?? clinicFromState.name ?? "";

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  if (!clinicId) {
    setLoading(false);
    setError("No clinic selected");
    return;
  }

  const controller = new AbortController();

  const fetchClinicData = async () => {
    try {
      // Replace fetch with Axios instance
      const res = await api.get(`/clinics/${clinicId}`, { signal: controller.signal });
      const clinic = res.data;

      const doctorList = Array.isArray(clinic.doctors)
        ? clinic.doctors.map((d, idx) => {
            if (typeof d === "string") return { id: String(idx), name: d, specialty: "General Practitioner" };
            return { id: d.id ?? d.name ?? String(idx), name: d.name ?? d.title ?? "Dr. Not Assigned", specialty: d.specialty ?? "General Practitioner" };
          })
        : [{ id: "0", name: "Dr. Not Assigned", specialty: "General" }];

      const serviceList = Array.isArray(clinic.services)
        ? clinic.services.map((s) => {
            if (typeof s === "string") return { id: s.toLowerCase().replace(/\s+/g, "-"), name: s };
            return { id: (s.id ?? String(s.name)).toString(), name: s.name ?? s.title ?? "Service" };
          })
        : [{ id: "general", name: "General Consultation" }];

      setDoctors(doctorList);
      setServices(serviceList);
      setError(null);
    } catch (err) {
      console.error("Error loading clinic data:", err);
      setError(err.message || "Failed to load clinic");
      setDoctors([{ id: "0", name: "Dr. Not Assigned", specialty: "General" }]);
      setServices([{ id: "general", name: "General Consultation" }]);
    } finally {
      setLoading(false);
    }
  };

  fetchClinicData();
  return () => controller.abort();
}, [clinicId]);

  // show clinic load error UI (unchanged styling)
  if (error && !loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <p className="text-red-800 font-medium">{error}</p>
          <p className="text-red-600 mt-2">
            We couldn't load the clinic details. It may have been removed or the ID is invalid.
          </p>
        </div>
        <button
          onClick={() => navigate("/find-clinics")}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Back to Find Clinics
        </button>
      </div>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: user?.fullName || "",
        service: "",
        doctor: "",
        date: "",
        time: "",
        reason: "",
      }}
      validationSchema={bookingSchema}
      onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
          setStatus(null);

          // tolerant matching for doctor id (string/number)
          const selectedDoctor = doctors.find((d) => String(d.id) === String(values.doctor));
          const selectedService = services.find((s) => String(s.id) === String(values.service));

          // Build payload with keys the backend expects
          const payload = {
            clinicId: Number(clinicId), // backend requires clinicId
            clinicName: clinicName || "", // optional but helpful
            // patient id is extracted from JWT on backend, don't need to send patientId
            doctor: selectedDoctor?.name || "Dr. Not Assigned",
            service: selectedService?.name || "General Consultation",
            date: values.date,
            time: values.time,
            notes: values.reason,
            status: "Pending",
          };

          // Use axios instance which already attaches Authorization header (api interceptor)
          const res = await api.post("/appointments/", payload);

          // success (flask sends 201)
          if (res.status === 201 || res.status === 200) {
            setStatus({ success: "Appointment booked successfully!" });
            resetForm();
            // keep UI flow the same
            setTimeout(() => {
              navigate("/checkups", { state: { fromBooking: true } });
            }, 1200);
          } else {
            // unexpected but handle gracefully
            setStatus({ error: "Unexpected response from server." });
          }
        } catch (err) {
          console.error("Booking failed:", err);

          // Prefer backend message fields: msg or message or error
          const msg =
            err?.response?.data?.msg ||
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to book. Please try again.";

          setStatus({ error: msg });

          // If auth header missing -> helpfully log out user locally or suggest re-login
          if (err?.response?.status === 401) {
            console.warn("Unauthorized — token missing/expired.");
            // Do not automatically logout; just hint in the status message
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="bg-white p-6 rounded-xl shadow-lg space-y-5 border border-gray-100 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900">Book an Appointment</h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <Field
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
            />
            <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading services...</p>
            ) : (
              <Field
                as="select"
                name="service"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="">Choose a service...</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage name="service" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading doctors...</p>
            ) : (
              <Field
                as="select"
                name="doctor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage name="doctor" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Field
                name="date"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <Field
                name="time"
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <ErrorMessage name="time" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <Field
              as="textarea"
              name="reason"
              rows={3}
              placeholder="Briefly describe your concern..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
            />
            <ErrorMessage name="reason" component="p" className="text-red-500 text-xs mt-1" />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-green-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : (
                "Book Now"
              )}
            </button>

            {status?.success && <span className="text-sm font-medium text-green-600 animate-pulse">{status.success}</span>}
            {status?.error && <span className="text-sm font-medium text-red-600">{status.error}</span>}
          </div>
        </Form>
      )}
    </Formik>
  );
}
