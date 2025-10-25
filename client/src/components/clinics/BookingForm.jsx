import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { bookAppointment } from "../../services/clinicService";

const bookingSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
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

  return (
    <Formik
      initialValues={{
        name: user?.fullName || "",
        date: "",
        time: "",
        reason: "",
      }}
      validationSchema={bookingSchema}
      onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
          await bookAppointment({
            ...values,
            clinicId,
            clinicName: clinicName || "Unknown Clinic",
          });
          setStatus({ success: "Appointment booked successfully!" });
          resetForm();
        } catch (err) {
          setStatus({ error: "Failed to book. Please try again." });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="bg-afyaLight p-6 rounded-xl shadow-lg space-y-5">
          <h3 className="text-xl font-bold text-afyaDark">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afyaBlue focus:border-transparent transition"
            />
            <ErrorMessage
              name="name"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afyaBlue focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afyaBlue focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afyaBlue focus:border-transparent resize-none"
            />
            <ErrorMessage
              name="reason"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Submit & Status */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-afyaBlue text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
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
              <span className="text-sm font-medium text-green-600 animate-fade-in">
                {status.success}
              </span>
            )}
            {status?.error && (
              <span className="text-sm font-medium text-red-600 animate-fade-in">
                {status.error}
              </span>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
