import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  BookOpen,
  Heart,
  User,
  Clock,
  BriefcaseMedical,
  LayoutDashboard,
  Stethoscope,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Phone,
  Mail,
  UserCheck, // Icon for Profile page active state
  ClipboardList, // Icon for Appointment History
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items
const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
    current: false,
  },
  {
    name: "Find Clinics",
    path: "/find-clinics",
    icon: MapPin,
    color: "text-green-500",
    current: false,
  },
  {
    name: "Symptom Checker",
    path: "/symptom-checker",
    icon: Stethoscope,
    color: "text-indigo-500",
    current: false,
  },
  {
    name: "Health Tips",
    path: "/health-tips",
    icon: BookOpen,
    color: "text-teal-500",
    current: false,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCheck, // Use a distinct icon for the active profile tab
    color: "text-yellow-500",
    current: true, // Mark this page as current for styling
  },
];

// 1. DashboardLayout Component (Shared Layout)
const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/profile"; // Hardcode current path for simplicity

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header/Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-green-600 fill-green-600" />
              <span className="text-xl font-bold text-gray-900">AfyaLink</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
              {navItems.map((item) => (
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
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.path === currentPath
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/logout"
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
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
// --- END: Dependency Definitions ---

// Mock data for the profile
const patientData = {
  fullName: "John Doe",
  profileInitials: "JD",
  email: "john.doe@example.com",
  memberSince: "Jan 2023",
  totalVisits: 12,
  bloodType: "O+",
  allergies: "Penicillin",
  emergencyContact: "Jane Doe • +254 700 111 111",
  personal: {
    phone: "+254 700 000 000",
    dob: "1990-01-01",
    gender: "Male",
    country: "Nairobi",
  },
  appointmentHistory: [
    {
      clinic: "Nairobi Health Center",
      doctor: "Dr. Jane Mwangi",
      service: "General",
      date: "2023-09-15",
      status: "Completed",
    },
    {
      clinic: "Westlands Medical Clinic",
      doctor: "Dr. Peter Kariuki",
      service: "Follow Up",
      date: "2023-09-22",
      status: "Completed",
    },
    {
      clinic: "Mombasa Community Clinic",
      doctor: "Dr. Sarah Ochieng",
      service: "Dental",
      date: "2023-07-10",
      status: "Completed",
    },
  ],
};

// Generic Text Input Field for display only
const ProfileField = ({ label, value, readOnly = true }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div
      className={`w-full p-3 rounded-lg border text-gray-800 ${
        readOnly ? "bg-gray-50 border-gray-200" : "bg-white border-blue-400"
      }`}
    >
      {value}
    </div>
  </div>
);

// Component for a single completed appointment history row
const AppointmentHistoryRow = ({ clinic, doctor, service, date, status }) => (
  <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 last:border-b-0">
    <div className="flex items-start space-x-4">
      <ClipboardList className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-800">{clinic}</h4>
        <p className="text-sm text-gray-600">
          {doctor} • {service}
        </p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          {date}
        </div>
      </div>
    </div>
    <span className="text-xs font-semibold px-3 py-1 rounded-full text-green-700 bg-green-100 mt-3 sm:mt-0">
      {status}
    </span>
  </div>
);

const PatientProfile = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition duration-150">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-500 text-white font-bold text-4xl rounded-full flex items-center justify-center mb-4 shadow-lg">
              {patientData.profileInitials}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {patientData.fullName}
            </h3>
            <p className="text-base text-gray-500 mb-6">{patientData.email}</p>

            <div className="w-full space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {patientData.memberSince}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">
                  Total Visits
                </p>
                <p className="text-sm font-semibold text-green-600">
                  {patientData.totalVisits} visits
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Blood Type</p>
                <span className="text-sm font-semibold px-3 py-0.5 rounded-full text-red-700 bg-red-100">
                  {patientData.bloodType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Full Name" value={patientData.fullName} />
              <ProfileField label="Email Address" value={patientData.email} />
              <ProfileField
                label="Phone Number"
                value={patientData.personal.phone}
              />
              <ProfileField
                label="Date of Birth"
                value={patientData.personal.dob}
              />
              <ProfileField
                label="Gender"
                value={patientData.personal.gender}
              />
              <ProfileField
                label="Country"
                value={patientData.personal.country}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Blood Type" value={patientData.bloodType} />
              <ProfileField label="Allergies" value={patientData.allergies} />
              <div className="md:col-span-2">
                <ProfileField
                  label="Emergency Contact"
                  value={patientData.emergencyContact}
                />
              </div>
            </div>
          </div>

          {/* Appointment History */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-100">
              Appointment History
            </h2>
            <div className="divide-y divide-gray-100">
              {patientData.appointmentHistory.map((appointment, index) => (
                <AppointmentHistoryRow key={index} {...appointment} />
              ))}
              {patientData.appointmentHistory.length === 0 && (
                <p className="text-gray-500 py-4">
                  No past appointments found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Import necessary icons that were missing
const Pencil = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

export default PatientProfile;
