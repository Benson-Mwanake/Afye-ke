// src/pages/clinic/ClinicPatients.jsx
import React, { useState, useEffect } from "react";
import { Search, Phone, Calendar, Mail, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";
import EditPatientModal from "../components/clinics/EditPatientModal";

const API_URL = "http://127.0.0.1:5000";

const ClinicPatients = () => {
  const { user, token } = useAuth(); // make sure your context provides the JWT token
  const [patients, setPatients] = useState([]);
  const [lastVisitMap, setLastVisitMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.clinicId || !token) {
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch appointments with JWT header
        const apptRes = await fetch(
          `${API_URL}/appointments?clinicId=${user.clinicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!apptRes.ok) {
          throw new Error(`Failed to fetch appointments: ${apptRes.status}`);
        }

        const appts = await apptRes.json();

        if (!Array.isArray(appts) || appts.length === 0) {
          setPatients([]);
          setLastVisitMap({});
          setLoading(false);
          return;
        }

        // 2️⃣ Get unique patient IDs
        const patientIds = [...new Set(appts.map((a) => a.patientId))];

        // 3️⃣ Fetch patient details with JWT header
        const patientRes = await fetch(
          `${API_URL}/users?id=${patientIds.join("&id=")}&role=patient`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!patientRes.ok) {
          throw new Error(`Failed to fetch patients: ${patientRes.status}`);
        }

        const patientData = await patientRes.json();

        // 4️⃣ Map last visit dates
        const visitMap = {};
        appts.forEach((appt) => {
          const pid = appt.patientId;
          const date = appt.date;
          if (date && (!visitMap[pid] || date > visitMap[pid])) {
            visitMap[pid] = date;
          }
        });

        setLastVisitMap(visitMap);
        setPatients(patientData);
      } catch (err) {
        console.error("Failed to load patients:", err);
        alert("Error loading patients: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, token]);

  const filtered = patients.filter(
    (p) =>
      (p.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never visited";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSavePatient = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  if (loading) {
    return (
      <ClinicDashboardLayout>
        <div className="p-8 text-center">Loading patients...</div>
      </ClinicDashboardLayout>
    );
  }

  if (patients.length === 0) {
    return (
      <ClinicDashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-500">
              No patients have booked appointments with this clinic yet.
            </p>
          </div>
        </div>
      </ClinicDashboardLayout>
    );
  }

  return (
    <ClinicDashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Patients Who Used This Clinic
            </h1>
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
            {filtered.map((p) => {
              const lastVisit = lastVisitMap[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {(p.fullName || "??")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.fullName || "Unknown Patient"}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1" /> {p.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-600">
                    <p className="flex items-center justify-end">
                      <Phone className="w-3 h-3 mr-1" /> {p.phoneNumber || "—"}
                    </p>
                    <p className="flex items-center justify-end mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Last visit: {formatDate(lastVisit)}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingPatient(p)}
                    className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-green-600 hover:text-green-700"
                    title="Edit Patient"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleSavePatient}
        />
      )}
    </ClinicDashboardLayout>
  );
};

export default ClinicPatients;
