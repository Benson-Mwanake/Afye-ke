/ src/components/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000";

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

export default function BookingForm({ clinicId, clinicName }) {
 const { user } = useAuth();
 const navigate = useNavigate();
 const [doctors, setDoctors] = useState([]);
 const [services, setServices] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null); 

 useEffect(() => {
 const controller = new AbortController();

 const fetchClinicData = async () => {
 try {
 const res = await fetch(`${API_URL}/clinics/${clinicId}`, {
 signal: controller.signal,
 });

 if (!res.ok) throw new Error("Clinic not found");

 const clinic = await res.json();

 const doctorList = Array.isArray(clinic.doctors)
 ? clinic.doctors.map((d) => ({
 id: d.id || d.name,
 name: d.name,
 specialty: d.specialty || "General Practitioner",
 }))
 : [{ id: "dr1", name: "Dr. Not Assigned", specialty: "General" }];

 const serviceList = Array.isArray(clinic.services)
 ? clinic.services.map((s) => ({
 id: s.toLowerCase().replace(/\s+/g, "-"),
 name: s,
 }))
 : [{ id: "general", name: "General Consultation" }];

 setDoctors(doctorList);
 setServices(serviceList);
 setError(null);
 } catch (err) {
 console.error("Error loading clinic data:", err);
 setError(err.message);
 setDoctors([
 { id: "dr1", name: "Dr. Not Assigned", specialty: "General" },
 ]);
 setServices([{ id: "general", name: "General Consultation" }]);
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
 <p className="text-red-600 mt-2">
 We couldn't load the clinic details. It may have been removed or the
 ID is invalid.
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
 const selectedDoctor = doctors.find((d) => d.id === values.doctor);
 const selectedService = services.find((s) => s.id === values.service);

 const serviceName = selectedService?.name || "General Consultation";
 const reason = values.reason.toLowerCase();
 const isCheckup =
 serviceName.toLowerCase().includes("checkup") ||
 reason.includes("checkup");

 const appointment = {
 patientId: Number(user.id),
 clinicId: clinicId,
 clinicName: clinicName || "Unknown Clinic",
 doctor: selectedDoctor?.name || "Dr. Not Assigned",
 service: serviceName,
 date: values.date,
 time: values.time,
 status: isCheckup ? "Scheduled" : "Pending",
 notes: values.reason,
 };

 const res = await fetch(`${API_URL}/appointments`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(appointment),
 });

 if (!res.ok) throw new Error("Booking failed");

 setStatus({ success: "Appointment booked successfully!" });
 resetForm();

 setTimeout(() => {
 navigate("/checkups", { state: { fromBooking: true } });
 }, 1200);
 } catch (err) {
 console.error(err);
 setStatus({ error: "Failed to book. Please try again." });
 } finally {
 setSubmitting(false);
 }
 }}
 >
 {({ isSubmitting, status }) => (
 <Form className="bg-white p-6 rounded-xl shadow-lg space-y-5 border border-gray-100 max-w-2xl mx-auto">
 <h3 className="text-xl font-bold text-gray-900">
 Book an Appointment
 </h3>

 {/* Name */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Your Name
 </label>
 <Field
 name="name"
 type="text"
 placeholder="John Doe"
 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
 />
 <ErrorMessage
 name="name"
 component="p"
 className="text-red-500 text-xs mt-1"
 />
 </div>

 {/* Service */}
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
 <ErrorMessage
 name="service"
 component="p"
 className="text-red-500 text-xs mt-1"
 />
 </div>

 {/* Doctor */}
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
 <ErrorMessage
 name="doctor"
 component="p"
 className="text-red-500 text-xs mt-1"
 />
 </div>

 {/* Date & Time */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Date
 </label>
 <Field
 name="date"
 type="date"
 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
 />
 <ErrorMessage
 name="time"
 component="p"
 className="text-red-500 text-xs mt-1"
 />
 </div>
 </div>

 {/* Reason */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 Reason for Visit
 </label>
 <Field
 as="textarea"
 name="reason"
 rows={3}
 placeholder="Briefly describe your concern..."
 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
 />
 <ErrorMessage
 name="reason"
 component="p"
 className="text-red-500 text-xs mt-1"
 />
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
 <circle
 className="opacity-25"
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 ></circle>
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
 ></path>
 </svg>
 Booking...
 </>
 ) : (
 "Book Now"
 )}
 </button>

 {status?.success && (
 <span className="text-sm font-medium text-green-600 animate-pulse">
 {status.success}
 </span>
 )}
 {status?.error && (
 <span className="text-sm font-medium text-red-600">
 {status.error}
 </span>
 )}
 </div>
 </Form>
 )}
 </Formik>
 );
}