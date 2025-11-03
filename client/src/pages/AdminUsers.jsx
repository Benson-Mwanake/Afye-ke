import React, { useEffect, useState } from "react";
import AdminLayout from "../hooks/layouts/AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) return alert("User not authenticated");

        const res = await fetch("https://gadgetreview-5c3b.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Error loading users: " + err.message);
      }
    };

    fetchUsers();
  }, [token]);

  // Filter users by search term (name/email)
  const filteredUsers = users.filter(
    u =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">All Users</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Clinic (if applicable)</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.fullName || "—"}</td>
                  <td className="px-4 py-3">{u.email || "—"}</td>
                  <td className="px-4 py-3">{u.phone || u.contactNumber || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "clinic"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{u.clinicName || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
