import React from "react";

const StatsOverview = () => {
  const stats = [
    { label: "Patients Served", value: 32 },
    { label: "Reports Submitted", value: 14 },
    { label: "Upcoming Visits", value: 4 },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-blue-50 p-6 rounded-xl text-center shadow-sm border border-blue-100"
        >
          <h4 className="text-3xl font-bold text-blue-700">{s.value}</h4>
          <p className="text-gray-600">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
