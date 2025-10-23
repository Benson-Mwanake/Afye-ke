import React, { useState } from "react";
import PatientList from "./PatientList";
import ReportForm from "./ReportForm";
import StatsOverview from "./StatsOverview";
import { useAuth } from "../../hooks/useAppHooks";

const CHVDashboard = () => {
  const [tab, setTab] = useState("patients");
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">CHV Dashboard</h2>
      {user && (
        <div className="bg-surface p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-primary">Profile</h3>
          <p className="text-text-secondary">Name: {user.full_name}</p>
          <p className="text-text-secondary">County: {user.county}</p>
        </div>
      )}
      <div className="flex space-x-4 mb-6">
        {["patients", "reports", "stats"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${
              tab === t
                ? "bg-primary text-white"
                : "bg-gray-100 text-text-secondary"
            } hover:bg-primary-light transition`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-6">
        {tab === "patients" && <PatientList />}
        {tab === "reports" && <ReportForm />}
        {tab === "stats" && <StatsOverview />}
      </div>
    </div>
  );
};

export default CHVDashboard;
