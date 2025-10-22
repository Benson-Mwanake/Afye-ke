import React, { useState } from "react";
import PatientList from "./PatientList";
import ReportForm from "./ReportForm";
import StatsOverview from "./StatsOverview";

const CHVDashboard = () => {
  const [tab, setTab] = useState("patients");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">CHV Dashboard</h2>

      <div className="flex space-x-4 mb-6">
        {["patients", "reports", "stats"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "patients" && <PatientList />}
      {tab === "reports" && <ReportForm />}
      {tab === "stats" && <StatsOverview />}
    </div>
  );
};

export default CHVDashboard;
