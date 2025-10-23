import React, { useState } from "react";
import {
  Calendar,
  User,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserCheck, // Profile icon
  MapPin,
  Heart,
  Upload, // For image upload
  Mail, // For contact support
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items for the Clinic Provider
const navItems = [
  {
    name: "Dashboard",
    path: "/clinic-dashboard",
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: "Clinic Profile",
    path: "/clinic-profile",
    icon: UserCheck,
    current: true, // Mark this page as current
  },
];

// 1. DashboardLayout Component
const ClinicDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/clinic/profile"; // Hardcode current path

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
              <span className="ml-2 text-sm font-semibold text-gray-500 border-l pl-2 border-gray-200">
                Provider
              </span>
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

// --- END: Dependency Definitions ---

// Mock Data Structure for form state
const initialClinicData = {
  clinicName: "Nairobi Health Center",
  description: "Describe your clinic and services...",
  phone: "+254 700 111 111",
  email: "info@nairobihealthcenter.co.ke",
  website: "www.nairobihealthcenter.co.ke",
  county: "Nairobi County",
  areaTown: "Westlands, Nairobi",
  fullAddress: "Parklands Road, Westlands",
  operatingHours: {
    mondayFriday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    saturday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    sunday: { open: "Closed", close: "Closed", isClosed: true },
  },
  services: {
    generalPractice: true,
    laboratoryServices: false,
    dentalCare: true,
    xRay: false,
    surgery: false,
    physiotherapy: false,
    pediatrics: true,
    pharmacy: true,
    maternity: false,
    immunization: true,
    emergencyServices: false,
    mentalHealth: false,
  },
};

// Helper components for the form inputs
const TextInput = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      type="text"
      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition duration-150"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const TextArea = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <textarea
      rows="4"
      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition duration-150"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const CheckboxInput = ({ label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={label.replace(/\s/g, "")}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
    />
    <label
      htmlFor={label.replace(/\s/g, "")}
      className="ml-2 text-sm text-gray-700"
    >
      {label}
    </label>
  </div>
);

// Component for a single Operating Hour row
const OperatingHourRow = ({ label, hours, onToggle, onTimeChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100">
    <div className="text-base font-medium text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">
      {label}
    </div>

    {!hours.isClosed ? (
      <div className="flex space-x-3 w-full sm:w-2/3">
        <input
          type="time"
          value={hours.open.split(" ")[0]}
          onChange={(e) => onTimeChange("open", e.target.value)}
          className="w-1/2 p-2 rounded-lg border border-gray-300"
        />
        <input
          type="time"
          value={hours.close.split(" ")[0]}
          onChange={(e) => onTimeChange("close", e.target.value)}
          className="w-1/2 p-2 rounded-lg border border-gray-300"
        />
        <button
          onClick={onToggle}
          className="text-red-500 text-sm hover:text-red-700"
        >
          Close
        </button>
      </div>
    ) : (
      <div className="flex justify-between items-center w-full sm:w-2/3">
        <span className="text-red-500 font-semibold">Closed</span>
        <button
          onClick={onToggle}
          className="text-green-600 text-sm hover:text-green-700"
        >
          Open
        </button>
      </div>
    )}
  </div>
);

const ClinicProfile = () => {
  // State to manage all form data
  const [formData, setFormData] = useState(initialClinicData);

  const handleBasicChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleServicesChange = (key) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [key]: !formData.services[key],
      },
    });
  };

  const handleHoursToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          isClosed: !prev.operatingHours[day].isClosed,
        },
      },
    }));
  };

  const handleTimeChange = (day, type, value) => {
    // Simple 24h to 12h conversion for display coherence with mock data.
    const [h, m] = value.split(":");
    let hours = parseInt(h);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const time12h = `${hours}:${m} ${ampm}`;

    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [type]: time12h,
        },
      },
    }));
  };

  // Calculate profile completion percentage
  const profileCompletion = 85; // Static for mock, would be calculated dynamically

  const servicesList = [
    { key: "generalPractice", label: "General Practice" },
    { key: "laboratoryServices", label: "Laboratory Services" },
    { key: "dentalCare", label: "Dental Care" },
    { key: "xRay", label: "X-Ray" },
    { key: "surgery", label: "Surgery" },
    { key: "physiotherapy", label: "Physiotherapy" },
    { key: "pediatrics", label: "Pediatrics" },
    { key: "pharmacy", label: "Pharmacy" },
    { key: "maternity", label: "Maternity" },
    { key: "immunization", label: "Immunization" },
    { key: "emergencyServices", label: "Emergency Services" },
    { key: "mentalHealth", label: "Mental Health" },
  ];

  return (
    <ClinicDashboardLayout>
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Clinic Profile
          </h1>
          <p className="text-gray-500">
            Update your clinic information and services
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition duration-150">
            Cancel
          </button>
          <button className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition duration-150">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Sections (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <TextInput
                label="Clinic Name"
                placeholder="Nairobi Health Center"
                value={formData.clinicName}
                onChange={(e) =>
                  handleBasicChange("clinicName", e.target.value)
                }
              />
              <TextArea
                label="Description"
                placeholder="Describe your clinic and services..."
                value={formData.description}
                onChange={(e) =>
                  handleBasicChange("description", e.target.value)
                }
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Phone Number"
                placeholder="+254 700 111 111"
                value={formData.phone}
                onChange={(e) => handleBasicChange("phone", e.target.value)}
              />
              <TextInput
                label="Email Address"
                placeholder="info@clinic.com"
                value={formData.email}
                onChange={(e) => handleBasicChange("email", e.target.value)}
              />
              <div className="md:col-span-2">
                <TextInput
                  label="Website (Optional)"
                  placeholder="www.yourclinic.com"
                  value={formData.website}
                  onChange={(e) => handleBasicChange("website", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="County"
                placeholder="Nairobi County"
                value={formData.county}
                onChange={(e) => handleBasicChange("county", e.target.value)}
              />
              <TextInput
                label="Area/Town"
                placeholder="Westlands, Nairobi"
                value={formData.areaTown}
                onChange={(e) => handleBasicChange("areaTown", e.target.value)}
              />
              <div className="md:col-span-2">
                <TextInput
                  label="Full Address"
                  placeholder="Parklands Road, Westlands"
                  value={formData.fullAddress}
                  onChange={(e) =>
                    handleBasicChange("fullAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Operating Hours
            </h2>
            <OperatingHourRow
              label="Monday - Friday"
              hours={formData.operatingHours.mondayFriday}
              onToggle={() => handleHoursToggle("mondayFriday")}
              onTimeChange={(type, value) =>
                handleTimeChange("mondayFriday", type, value)
              }
            />
            <OperatingHourRow
              label="Saturday"
              hours={formData.operatingHours.saturday}
              onToggle={() => handleHoursToggle("saturday")}
              onTimeChange={(type, value) =>
                handleTimeChange("saturday", type, value)
              }
            />
            <OperatingHourRow
              label="Sunday"
              hours={formData.operatingHours.sunday}
              onToggle={() => handleHoursToggle("sunday")}
              onTimeChange={(type, value) =>
                handleTimeChange("sunday", type, value)
              }
            />
          </div>

          {/* Services Offered */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Services Offered
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {servicesList.map((service) => (
                <CheckboxInput
                  key={service.key}
                  label={service.label}
                  checked={formData.services[service.key]}
                  onChange={() => handleServicesChange(service.key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Images and Status (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Clinic Images */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Clinic Images
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition duration-150 cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Upload clinic photos
              </p>
              <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
            </div>

            {/* Mock Image Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Profile Status
            </h2>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Profile Completion
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-right text-sm font-semibold text-gray-800 mt-1">
                {profileCompletion}%
              </p>
            </div>

            <div className="space-y-1 text-sm text-red-600">
              <p className="font-medium">Missing:</p>
              <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
                <li>Clinic photos (3)</li>
                <li>Professional licenses</li>
              </ul>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Contact our support team for assistance with your clinic profile.
            </p>
            <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-150">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicProfile;
