import React from "react";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { Users } from "lucide-react";

const AdminUsers = () => {
  console.log("AdminUsers: Rendering test content");
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Manage Users
        </h1>
        <p className="text-lg text-gray-600">View and manage system users</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add User
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center space-x-4 py-4 bg-red-500 text-white">
            <Users className="w-6 h-6" />
            <p>Test content: This should be visible!</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
