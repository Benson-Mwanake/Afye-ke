import React, { useState } from "react";

const ReportForm = () => {
  const [report, setReport] = useState({ name: "", notes: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Report submitted for ${report.name}`);
    setReport({ name: "", notes: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">Submit Visit Report</h3>
      <input
        type="text"
        placeholder="Patient Name"
        className="border rounded p-2 w-full mb-3"
        value={report.name}
        onChange={(e) => setReport({ ...report, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Report notes..."
        className="border rounded p-2 w-full mb-3"
        rows="4"
        value={report.notes}
        onChange={(e) => setReport({ ...report, notes: e.target.value })}
        required
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ReportForm;