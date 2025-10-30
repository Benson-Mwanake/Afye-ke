import React, { useEffect, useState } from "react";
import AdminLayout from "../hooks/layouts/AdminLayout";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!token) return alert("User not authenticated");

        const res = await fetch("http://127.0.0.1:5000/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
        alert("Error loading reports: " + err.message);
      }
    };

    fetchReports();
  }, [token]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-left">Submitted By</th>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{r.title}</td>
              <td className="border px-4 py-2">{r.submittedBy}</td>
              <td className="border px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminReports;
