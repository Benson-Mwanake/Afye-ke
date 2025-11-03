// client/src/hooks/layouts/ClinicLayout.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserCheck,
  Heart,
  Clock,
  Users,
  BarChart2,
} from "lucide-react";

const ClinicDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ALL NAV ITEMS (main + quick actions)
  const navItems = [
    // Main
    { name: "Dashboard", path: "/clinic-dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "/clinic-availability", icon: Clock, color: "text-green-600"},
    { name: "Patients", path: "/clinic-patients", icon: Users, color: "text-blue-600"},
    { name: "Analytics", path: "/clinic-analytics", icon: BarChart2, color: "text-indigo-600"},
    { name: "Clinic Profile", path: "/clinic-profile", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-green-600 fill-green-600" />
              <span className="text-xl font-bold text-gray-900">AfyaLink</span>
              <span className="ml-2 text-sm font-semibold text-gray-500 border-l pl-2 border-gray-200">
                Provider
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item, idx) => {
                if (item.divider) {
                  return (
                    <div key={idx} className="h-6 w-px bg-gray-300 mx-2"></div>
                  );
                }

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 
                      ${
                        location.pathname === item.path
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    title={item.name}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        location.pathname === item.path
                          ? "text-green-600"
                          : item.color || "text-gray-500"
                      }`}
                    />
                    <span className="hidden lg:inline">{item.name}</span>
                  </button>
                );
              })}

              {/* Logout */}
              <button
                onClick={() => navigate("/logout")}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition duration-150 ml-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile toggle */}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {/* Main Nav */}
              {navItems
                .filter((item) => !item.divider)
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-base font-medium transition ${
                      location.pathname === item.path
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        location.pathname === item.path
                          ? "text-green-600"
                          : item.color || "text-gray-600"
                      }`}
                    />
                    <span>{item.name}</span>
                  </button>
                ))}

              {/* Logout */}
              <div className="pt-3 border-t border-gray-200 mt-3">
                <button
                  onClick={() => navigate("/logout")}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default ClinicDashboardLayout;
