import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { CheckCircle, Clock } from "lucide-react";

// Approval Row
const AdminApprovalRow = ({
  clinicName,
  location,
  email,
  phone,
  services,
  onApprove,
  onReject,
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
          <p className="text-sm text-gray-600 line-clamp-1">{location}</p>
          <p className="text-sm text-gray-600 line-clamp-1">
            {services.join(", ")}
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {email} • {phone}
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
          Pending
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onApprove}
          className="text-xs font-medium text-green-600 hover:text-green-700"
        >
          Approve
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={onReject}
          className="text-xs font-medium text-red-600 hover:text-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

const AdminApprovals = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/clinics?status=pending");
        if (!res.ok) throw new Error("Failed to fetch pending clinics");
        const data = await res.json();
        setClinics(data);
      } catch (err) {
        console.error("Approvals load error:", err);
        alert(`Failed to load clinics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", verified: true }),
      });
      setClinics((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to approve clinic");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this clinic?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/clinics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", verified: false }),
      });
      setClinics((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to reject clinic");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          Loading approvals...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Clinic Approvals
        </h1>
        <p className="text-lg text-gray-600">
          Review pending clinic registrations
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
          <span className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1 rounded-full">
            {clinics.length} pending
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {clinics.length > 0 ? (
            clinics.map((clinic) => (
              <AdminApprovalRow
                key={clinic.id}
                clinicName={clinic.name}
                location={clinic.location}
                email={clinic.email}
                phone={clinic.phone}
                services={clinic.services}
                onApprove={() => handleApprove(clinic.id)}
                onReject={() => handleReject(clinic.id)}
              />
            ))
          ) : (
            <p className="text-gray-500 py-4">No pending approvals.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApprovals;
