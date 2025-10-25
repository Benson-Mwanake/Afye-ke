// src/pages/clinic/ClinicPatients.jsx
import React, { useState, useEffect } from "react";
import { Search, User, Phone, Calendar, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const ClinicPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.clinicId) return;
      const apptRes = await fetch(
        `http://localhost:4000/appointments?clinicId=${user.clinicId}`
      );
      const appts = await apptRes.json();
      const patientIds = [...new Set(appts.map((a) => a.patientId))];
      const patientRes = await fetch(
        `http://localhost:4000/users?id=${patientIds.join("&id=")}`
      );
      const data = await patientRes.json();
      setPatients(data);
      setLoading(false);
    };
    fetchPatients();
  }, [user]);

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-8 text-center">Loading patients...</div>;

    return (
      <ClinicDashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Patients</h1>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      {p.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1" /> {p.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p className="flex items-center justify-end">
                      <Phone className="w-3 h-3 mr-1" /> {p.phoneNumber}
                    </p>
                    <p className="flex items-center justify-end mt-1">
                      <Calendar className="w-3 h-3 mr-1" /> Last visit:
                      2025-10-20
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ClinicDashboardLayout>
    );
};

export default ClinicPatients;
