// src/hooks/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  CheckCircle,
  ClipboardList,
  BarChart2,
  Users,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Clinic Approvals", path: "/admin-approvals", icon: CheckCircle },
    { name: "Articles", path: "/admin-articles", icon: ClipboardList },
    { name: "Reports", path: "/admin-reports", icon: BarChart2 },
    { name: "Users", path: "/admin-users", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-green-600 fill-green-600" />
              <span className="text-xl font-bold text-gray-900">AfyaLink</span>
              <span className="ml-2 text-sm font-semibold text-gray-500 border-l pl-2 border-gray-200">
                Admin
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                    location.pathname === item.path
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      location.pathname === item.path
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition duration-150"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
