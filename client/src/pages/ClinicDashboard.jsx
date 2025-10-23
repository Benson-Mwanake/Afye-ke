import React, { useState } from "react";
import {
  Calendar,
  User,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Star, // For ratings
  Clock3, // For wait time
  Users, // For patients
  CheckCircle, // For appointments this week
  UserCheck, // For profile icon
  MapPin, // For address
  ClipboardList, // For quick actions
  BarChart2, // For analytics
  BriefcaseMedical, // For Appointment icon
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items for the Clinic Provider
const navItems = [
  {
    name: "Dashboard",
    path: "/clinic-dashboard",
    icon: LayoutDashboard,
    current: true, // Mark this page as current
  },
  {
    name: "Clinic Profile",
    path: "/clinic-profile",
    icon: UserCheck,
    current: false,
  },
];

// 1. DashboardLayout Component
const ClinicDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/clinic/dashboard"; // Hardcode current path

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

// 2. ClinicStatCard Component (Styled like the previous patient stat cards)
const ClinicStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
  const colorMap = {
    green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
    blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
    "dark-green": {
      bg: "bg-teal-600",
      text: "text-white",
      trend: "text-teal-200",
    },
    "light-blue": {
      bg: "bg-blue-600",
      text: "text-white",
      trend: "text-blue-200",
    },
  };
  const { bg, text, trend } = colorMap[color] || {
    bg: "bg-gray-600",
    text: "text-white",
    trend: "text-gray-200",
  };

  return (
    <div
      className={`${bg} p-6 sm:p-7 md:p-8 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl flex flex-col justify-between h-full`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>
          {title}
        </h3>
        <div className={`p-2 sm:p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${text}`} />
        </div>
      </div>
      <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>
        {value}
      </p>
      <p className={`mt-2 text-sm ${trend} font-medium`}>{trendValue}</p>
    </div>
  );
};

// 3. Appointment Row for Today/Upcoming sections
const ClinicAppointmentRow = ({
  patientName,
  initial,
  service,
  time,
  status,
  isToday,
}) => {
  // Determine status styling
  let statusClass = "";
  let statusText = status;
  if (status === "confirmed") {
    statusClass = "bg-green-100 text-green-700";
  } else if (status === "pending") {
    statusClass = "bg-yellow-100 text-yellow-700";
  } else if (status === "cancelled") {
    statusClass = "bg-red-100 text-red-700";
  }

  return (
    <div className="py-4 flex justify-between items-center space-x-4 border-b border-gray-100">
      <div className="flex items-center space-x-4 flex-grow">
        {/* Patient Initial Circle */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
            isToday ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          {initial}
        </div>
        {/* Appointment Details */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{patientName}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{service}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {time}
          </div>
        </div>
        {/* Status Badge - Only for Today's Appointments */}
        {isToday && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${statusClass} flex-shrink-0`}
          >
            {statusText}
          </span>
        )}
      </div>

      {/* Actions (Only for Today's Appointments) */}
      {isToday ? (
        <div className="flex space-x-2 flex-shrink-0">
          <button className="text-xs font-medium text-green-600 hover:text-green-700 transition duration-150">
            Complete
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-xs font-medium text-red-600 hover:text-red-700 transition duration-150">
            Cancel
          </button>
        </div>
      ) : (
        <button className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition flex-shrink-0">
          Reschedule
        </button>
      )}
    </div>
  );
};

// Mock Data
const clinicData = {
  name: "Nairobi Health Center",
  address: "Westlands, Nairobi",
  initials: "NHC",
  stats: [
    {
      title: "Today's Appointments",
      value: 3,
      icon: Calendar,
      color: "green",
      trendValue: "2 new patients today",
    },
    {
      title: "Total Patients",
      value: 342,
      icon: Users,
      color: "blue",
      trendValue: "15% increase from last month",
    },
    {
      title: "Appointments This Week",
      value: 28,
      icon: CheckCircle,
      color: "dark-green",
      trendValue: "On track for goal",
    },
    {
      title: "Avg Wait Time",
      value: "45m",
      icon: Clock3,
      color: "light-blue",
      trendValue: "Goal: 30 minutes",
    },
  ],
  todayAppointments: [
    {
      id: 1,
      patientName: "Sarah Kimani",
      initial: "SK",
      service: "General Checkup",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "James Omondi",
      initial: "JO",
      service: "Follow-up",
      time: "11:30 AM",
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Mary Wanjiru",
      initial: "MW",
      service: "Vaccination",
      time: "2:00 PM",
      status: "pending",
    },
  ],
  upcomingAppointments: [
    {
      id: 4,
      patientName: "David Mutua",
      initial: "DM",
      service: "Dental Checkup",
      time: "9:00 AM",
      date: "2025-10-19",
      status: "confirmed",
    },
    {
      id: 5,
      patientName: "Grace Akinyi",
      initial: "GA",
      service: "Laboratory Test",
      time: "10:30 AM",
      date: "2025-10-19",
      status: "pending",
    },
  ],
  profileSummary: {
    status: "Open",
    rating: 4.8,
    reviews: 124,
  },
  operatingHours: [
    { day: "Monday - Friday", hours: "9AM - 8PM" },
    { day: "Saturday", hours: "9AM - 5PM" },
    { day: "Sunday", hours: "Closed" },
  ],
};

const ClinicDashboard = () => {
  // Simple state/logic for demonstration
  const totalTodayAppointments = clinicData.todayAppointments.length;

  return (
    <ClinicDashboardLayout>
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Clinic Dashboard
        </h1>
        <p className="text-lg text-gray-600">Welcome back, {clinicData.name}</p>
      </div>

      {/* 1. Clinic Overview Stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {clinicData.stats.map((stat) => (
            <ClinicStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2. Main Content Grid (Left: Appointments, Right: Profile/Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Appointments (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Today's Appointments
              </h2>
              <span className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1 rounded-full">
                {totalTodayAppointments} appointments
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {clinicData.todayAppointments.map((appointment) => (
                <ClinicAppointmentRow
                  key={appointment.id}
                  {...appointment}
                  isToday={true}
                  time={appointment.time}
                />
              ))}
              {totalTodayAppointments === 0 && (
                <p className="text-gray-500 py-4">
                  No appointments scheduled for today.
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700 transition duration-150">
                View All Schedule
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {clinicData.upcomingAppointments.map((appointment) => (
                <ClinicAppointmentRow
                  key={appointment.id}
                  {...appointment}
                  isToday={false}
                  time={`${appointment.date} @ ${appointment.time}`}
                />
              ))}
              {clinicData.upcomingAppointments.length === 0 && (
                <p className="text-gray-500 py-4">
                  No future appointments currently scheduled.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Summary & Actions (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Clinic Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 text-white font-bold text-2xl rounded-full flex items-center justify-center mb-3">
              {clinicData.initials}
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {clinicData.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {clinicData.address}
            </p>
            <button
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-150 bg-blue-50 px-4 py-2 rounded-lg"
              onClick={() => console.log("Navigate to Clinic Profile Edit")}
            >
              Edit Clinic Profile
            </button>

            <div className="w-full pt-4 mt-4 border-t border-gray-100 space-y-2">
              {/* Status */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-0.5 rounded-full">
                  {clinicData.profileSummary.status}
                </span>
              </div>
              {/* Rating */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-sm font-semibold text-gray-800">
                    {clinicData.profileSummary.rating}
                  </p>
                </div>
              </div>
              {/* Reviews */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-sm font-semibold text-gray-800">
                  {clinicData.profileSummary.reviews}
                </p>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Operating Hours
            </h4>
            <div className="space-y-2">
              {clinicData.operatingHours.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <p className="text-gray-600">{item.day}</p>
                  <p
                    className={`font-semibold ${
                      item.hours === "Closed" ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {item.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition">
                <Clock className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-medium">Manage Availability</span>
              </button>
              <button className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition">
                <Users className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">View All Patients</span>
              </button>
              <button className="flex items-center w-full px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition">
                <BarChart2 className="w-5 h-5 mr-3 text-indigo-500" />
                <span className="font-medium">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicDashboard;
