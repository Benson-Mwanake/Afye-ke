import React, { useState } from "react";
import {
  Users,
  BriefcaseMedical,
  Calendar,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Check,
  ClipboardList,
  BarChart2,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Eye,
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items for the Admin, marking "Clinic Approvals" as current
const adminNavItems = [
  {
    name: "Dashboard",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Clinic Approvals",
    path: "/clinic-approvals",
    icon: Check,
    current: true,
  },
  {
    name: "Articles",
    path: "/manage-articles",
    icon: ClipboardList,
    current: false,
  },
  { name: "Reports", path: "/admin/reports", icon: BarChart2, current: false },
];

// 1. AdminDashboardLayout Component (Reusable)
const AdminDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/admin/approvals"; // Set current path to Clinic Approvals

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header/Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Role */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="https://placehold.co/32x32/10b981/ffffff?text=AL"
                alt="AfyaLink Logo"
                className="w-8 h-8 mr-2"
              />
              <span className="text-xl font-bold text-gray-900">AfyaLink</span>
              <span className="ml-2 text-sm font-semibold text-gray-500 border-l pl-2 border-gray-200">
                Admin
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
              {adminNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 
                    ${
                      item.path === currentPath
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                    }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      item.path === currentPath
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </a>
              ))}
              <a
                href="/logout"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition duration-150"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {adminNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.path === currentPath
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="inline w-4 h-4 mr-2" />
                  {item.name}
                </a>
              ))}
              <a
                href="/logout"
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="inline w-4 h-4 mr-2" />
                Logout
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

// 2. Admin Stat Card Component (Adapted for Approval Stats with solid colors and larger size)
const ApprovalStatCard = ({ title, value, colorClass, icon: Icon }) => {
  return (
    // Increased padding (p-8) and removed border/bg-white for solid color
    <div
      className={`p-8 rounded-xl shadow-lg ${colorClass} text-white transition-shadow duration-300 hover:shadow-xl flex justify-between items-center h-full`}
    >
      <div>
        {/* Increased text size (text-5xl) */}
        <p className="text-5xl font-bold mb-1">{value}</p>
        {/* Increased text size (text-lg) */}
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
      </div>
      {Icon && <Icon className="w-10 h-10 opacity-70" />}
    </div>
  );
};

// 3. Status Badge Helper
const StatusBadge = ({ status }) => {
  let color = "";
  let text = "";
  if (status === "Pending") {
    color = "bg-yellow-100 text-yellow-700";
  } else if (status === "Approved") {
    color = "bg-green-100 text-green-700";
  } else if (status === "Rejected") {
    color = "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${color} uppercase tracking-wider`}
    >
      {status}
    </span>
  );
};

// Mock Data for Clinic Approvals (Updated colors and added icons)
const approvalData = {
  stats: [
    {
      title: "Pending Approvals",
      value: 5,
      colorClass: "bg-red-600", // Changed to solid red background
      icon: AlertTriangle, // Added icon
    },
    {
      title: "Approved This Month",
      value: 28,
      colorClass: "bg-green-600", // Changed to solid green background
      icon: Check, // Added icon
    },
    {
      title: "Rejected",
      value: 3,
      colorClass: "bg-gray-500", // Changed to solid gray background
      icon: X, // Added icon
    },
    {
      title: "Total Clinics",
      value: 144,
      colorClass: "bg-blue-600", // Changed to solid blue background
      icon: BriefcaseMedical, // Added icon
    },
  ],
  pendingClinics: [
    {
      id: 1,
      name: "Kisumu Medical Centre",
      services: 4,
      location: "Town Centre, Kisumu County",
      phone: "+254 700 333 333",
      email: "info@kisumumedical.co.ke",
      submitted: "2025-10-14",
      status: "Pending",
    },
    {
      id: 2,
      name: "Eldoret Health Services",
      services: 4,
      location: "Eldoret Town, Eldoret County",
      phone: "+254 700 666 666",
      email: "contact@eldorethealth.co.ke",
      submitted: "2025-10-13",
      status: "Pending",
    },
    {
      id: 3,
      name: "Machakos Family Clinic",
      services: 3,
      location: "Machakos Town, Machakos County",
      phone: "+254 700 777 777",
      email: "info@machakosclinic.co.ke",
      submitted: "2025-10-12",
      status: "Pending",
    },
    {
      id: 4,
      name: "Kiambu Community Health",
      services: 4,
      location: "Kiambu Town, Kiambu County",
      phone: "+254 700 888 888",
      email: "info@kiambuhealth.co.ke",
      submitted: "2025-10-11",
      status: "Pending",
    },
    {
      id: 5,
      name: "Thika Medical Plaza",
      services: 3,
      location: "Thika Town, Kiambu County",
      phone: "+254 700 999 999",
      email: "info@thikamedical.co.ke",
      submitted: "2025-10-10",
      status: "Pending",
    },
  ],
};

const ClinicApprovals = () => {
  // State to hold the current list of clinics (to simulate approval/rejection)
  const [clinics, setClinics] = useState(approvalData.pendingClinics);

  // Simple action handler (in a real app, this would update Firestore)
  const handleAction = (id, action) => {
    // Find the clinic and update its status
    const updatedClinics = clinics.map((clinic) => {
      if (clinic.id === id) {
        return {
          ...clinic,
          status: action === "approve" ? "Approved" : "Rejected",
        };
      }
      return clinic;
    });

    // Filter out the clinics that were just approved/rejected to mimic removal from 'Pending' list
    setClinics(updatedClinics.filter((c) => c.status === "Pending"));

    // Log the action (or show a success toast in a real app)
    console.log(`Clinic ID ${id} was ${action}d.`);
  };

  return (
    <AdminDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Clinic Approvals
        </h1>
        <p className="text-lg text-gray-600">
          Review and approve clinic registrations
        </p>
      </div>

      {/* 1. Statistics Cards (Now with different colors and larger size) */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvalData.stats.map((stat) => (
            <ApprovalStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2. Clinic Approval Table */}
      <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Clinic Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    {/* Clinic Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {clinic.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {clinic.services} services
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {clinic.location.split(",")[0]}
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        {clinic.location.split(",")[1].trim()}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {clinic.phone}
                      </div>
                      <div className="text-sm text-blue-500 hover:text-blue-600 underline flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {clinic.email}
                      </div>
                    </td>

                    {/* Submitted */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {clinic.submitted}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={clinic.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                          onClick={() =>
                            console.log(
                              `Viewing details for clinic ID ${clinic.id}`
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition"
                          onClick={() => handleAction(clinic.id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition"
                          onClick={() => handleAction(clinic.id, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-lg text-gray-500"
                  >
                    🎉 All pending clinic registrations have been reviewed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminDashboardLayout>
  );
};

export default ClinicApprovals;
