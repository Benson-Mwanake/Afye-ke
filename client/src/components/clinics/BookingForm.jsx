import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ clinicId, clinicName }) {
  return <div>Booking Form Component</div>;
}