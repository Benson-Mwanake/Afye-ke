import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ clinicId, clinicName }) {
  return <div>Booking Form Component</div>;
}
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
const { user } = useAuth();
const navigate = useNavigate();
const [doctors, setDoctors] = useState([]);
const [services, setServices] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  const fetchClinicData = async () => { /* ...fetch logic... */ };
  fetchClinicData();
  return () => controller.abort();
}, [clinicId]);
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
  onSubmit=
>
  {({ isSubmitting, status }) => (
    <Form></Form>
  )}
</Formik>
