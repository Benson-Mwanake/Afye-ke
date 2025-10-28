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
