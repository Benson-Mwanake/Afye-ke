import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { Calendar, Clock } from "lucide-react";

const AdminReportRow = ({
  clinicName,
  doctor,
  service,
  date,
  time,
  status,
  notes,
}) => {
  return (
    <div className="py-4 flex justify-between items-center space-x-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4 flex-grow">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-blue-500">
          {clinicName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{clinicName}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">
            {service} • {doctor}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {date} {time}
            {notes && <span className="ml-2">• {notes}</span>}
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            status === "Confirmed"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : status === "Completed"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

const AdminReports = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:4000/appointments");
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Reports load error:", err);
        alert(`Failed to load appointments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          Loading reports...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Reports</h1>
        <p className="text-lg text-gray-600">View appointment statistics</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Appointment Reports
          </h2>
          <span className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1 rounded-full">
            {appointments.length} appointments
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <AdminReportRow
                key={appt.id}
                clinicName={appt.clinicName}
                doctor={appt.doctor}
                service={appt.service}
                date={appt.date}
                time={appt.time}
                status={appt.status}
                notes={appt.notes}
              />
            ))
          ) : (
            <p className="text-gray-500 py-4">No appointments available.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
