import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/articles" className="hover:text-gray-300">Articles</Link>
          <Link to="/admin/profile" className="hover:text-gray-300">Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
