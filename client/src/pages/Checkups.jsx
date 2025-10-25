import React from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CheckupItem = ({ title, date, status }) => {
  const isDue = status === "due";
  const isDone = status === "completed";

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        {isDone ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : isDue ? (
          <AlertCircle className="w-6 h-6 text-orange-600" />
        ) : (
          <Calendar className="w-6 h-6 text-gray-500" />
        )}
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          isDone
            ? "bg-green-100 text-green-700"
            : isDue
            ? "bg-orange-100 text-orange-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {isDone ? "Done" : isDue ? "Due" : "Scheduled"}
      </span>
    </div>
  );
};

export default function Checkups() {
  const { user } = useAuth();

  const checkups = [
    { title: "Annual Physical", date: "2025-12-10", status: "due" },
    { title: "Dental Cleaning", date: "2025-09-15", status: "completed" },
    { title: "Eye Exam", date: "2026-03-20", status: "scheduled" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Health Check-ups
        </h1>
        <p className="text-gray-600 mb-6">
          Keep track of your routine screenings and preventive care.
        </p>

        <div className="space-y-4">
          {checkups.map((c, i) => (
            <CheckupItem key={i} {...c} />
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Need to schedule a new check-up?
          </h3>
          <button
            onClick={() => (window.location.href = "/find-clinics")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Find a clinic
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
