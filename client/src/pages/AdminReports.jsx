import React, { useEffect, useState } from "react";
import AdminLayout from "../hooks/layouts/AdminLayout";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!token) return alert("User not authenticated");

        const res = await fetch("https://afya-ke.onrender.com/reports", {
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
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports available</p>
      ) : (
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
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{r.title}</td>
                <td className="border px-4 py-2">{r.submittedBy?.name || "Unknown"}</td>
                <td className="border px-4 py-2">
                  {r.date ? new Date(r.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="border px-4 py-2">{r.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminReports;
