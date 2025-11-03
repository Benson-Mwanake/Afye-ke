// src/components/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

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

export default function BookingForm({
  clinicId: propClinicId,
  clinicName: propClinicName,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const clinicFromState = location.state?.clinic || {};

  const clinicId = Number(propClinicId ?? clinicFromState.id);
  const clinicName = propClinicName ?? clinicFromState.name ?? "";

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clinicId || isNaN(clinicId)) {
      setError("Invalid clinic selected");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchClinicData = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/clinics/${clinicId}`, {
          signal: controller.signal,
        });
        const clinic = res.data;

        // SERVICES
        const serviceList = Array.isArray(clinic.services)
          ? clinic.services.map((s) => ({
              id:
                typeof s === "string"
                  ? s.toLowerCase().replace(/\s+/g, "-")
                  : s.id,
              name: typeof s === "string" ? s : s.name || "Service",
            }))
          : [{ id: "general", name: "General Consultation" }];

        // DOCTORS — from clinic.doctors (JSONB)
        const doctorList = Array.isArray(clinic.doctors)
          ? clinic.doctors.map((d, idx) => ({
              id: String(idx),
              name: d.name,
              specialty: d.specialty,
            }))
          : [{ id: "0", name: "Dr. Not Assigned", specialty: "General" }];

        setServices(serviceList);
        setDoctors(doctorList);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load clinic data");
          setDoctors([
            { id: "0", name: "Dr. Not Assigned", specialty: "General" },
          ]);
          setServices([{ id: "general", name: "General Consultation" }]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
    return () => controller.abort();
  }, [clinicId]);

  if (error && !loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
        <button
          onClick={() => navigate("/find-clinics")}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700"
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
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          setStatus(null);

          const selectedDoctor = doctors.find(
            (d) => String(d.id) === String(values.doctor)
          );
          const selectedService = services.find(
            (s) => String(s.id) === String(values.service)
          );

          const payload = {
            clinicId,
            clinicName: clinicName || "",
            doctor: selectedDoctor?.name || "Dr. Not Assigned",
            service: selectedService?.name || "General Consultation",
            date: values.date,
            time: values.time,
            notes: values.reason,
            status: "Pending",
          };

          const res = await api.post("/appointments/", payload);

          if (res.status === 201) {
            setStatus({ success: "Appointment booked!" });
            setTimeout(() => {
              navigate("/checkups", { state: { fromBooking: true } });
            }, 1200);
          }
        } catch (err) {
          const msg =
            err?.response?.data?.msg ||
            err?.message ||
            "Failed to book. Try again.";
          setStatus({ error: msg });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="bg-white p-6 rounded-xl shadow-lg space-y-5 border border-gray-100 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900">
            Book Appointment at {clinicName || "Clinic"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <Field
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Service
            </label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading services...</p>
            ) : (
              <Field
                as="select"
                name="service"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage
              name="service"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading doctors...</p>
            ) : (
              <Field
                as="select"
                name="doctor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage
              name="doctor"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Field
                name="date"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <ErrorMessage
                name="date"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <Field
                name="time"
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <ErrorMessage
                name="time"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit
            </label>
            <Field
              as="textarea"
              name="reason"
              rows={3}
              placeholder="Briefly describe your concern..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            />
            <ErrorMessage
              name="reason"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-green-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-70"
            >
              {isSubmitting ? "Booking..." : "Book Now"}
            </button>
            {status?.success && (
              <span className="text-green-600 font-medium">
                {status.success}
              </span>
            )}
            {status?.error && (
              <span className="text-red-600">{status.error}</span>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
