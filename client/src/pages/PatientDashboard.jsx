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
  CheckCircle, // New icon for reminder
  Phone, // New icon for emergency contact
  Mail, // New icon for support contact
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items matching the Figma header/dashboard links, with Dashboard active
const navItems = [
  {
    name: "Dashboard",
    path: "/patient-dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
    current: true, // Mark this page as current for styling
  },
  {
    name: "Find Clinics",
    path: "/find-clinics",
    icon: MapPin,
    color: "text-green-500",
  },
  {
    name: "Symptom Checker",
    path: "/symptom-checker",
    icon: Stethoscope,
    color: "text-indigo-500",
  },
  {
    name: "Health Tips",
    path: "/health-tips",
    icon: BookOpen,
    color: "text-teal-500",
  },
  { name: "Profile", path: "/profile", icon: User, color: "text-yellow-500" },
];

// 1. DashboardLayout Component
const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                      item.current
                        ? "bg-green-50 text-green-700 font-semibold"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                    }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      item.current ? "text-green-600" : "text-gray-500"
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
                    item.current
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

// 2. PatientStatCard Component (UPDATED FOR LARGER SIZE)
const PatientStatCard = ({ title, value, icon: Icon, color, trendValue }) => {
  // Map color names to Tailwind CSS classes for BOLD background and text
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

// 3. QuickActionCard Component
const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  iconColor,
  iconBg,
}) => (
  <button
    onClick={onClick}
    className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-left transition-all duration-200 hover:shadow-lg hover:border-green-300 flex items-center space-x-4 w-full h-full"
  >
    <div className={`p-3 rounded-full ${iconBg} flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </button>
);
// --- END: Dependency Definitions ---

// Mock data for the dashboard
const patientData = {
  fullName: "John Doe",
  profileInitials: "JD",
  email: "john.doe@example.com",
  stats: [
    {
      title: "Upcoming Appointments",
      value: 2,
      icon: Calendar,
      color: "green",
      trend: "2 in next 30 days",
    },
    {
      title: "Saved Clinics",
      value: 5,
      icon: MapPin,
      color: "blue", // Mapped to indigo-600
      trend: "2 new this month",
    },
    {
      title: "Articles Read",
      value: 12,
      icon: BookOpen,
      color: "dark-green", // Mapped to teal-600
      trend: "Great reading streak",
    },
    {
      title: "Health Checkups",
      value: 8,
      icon: Heart,
      color: "light-blue", // Mapped to blue-600
      trend: "Checkup due in 3 months",
    },
  ],
  upcomingAppointments: [
    {
      id: 1,
      clinic: "Nairobi Health Center",
      doctor: "Dr. Jane Mwangi",
      service: "General",
      date: "2025-10-18",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      clinic: "Westlands Medical Clinic",
      doctor: "Dr. Peter Kariuki",
      service: "Follow Up",
      date: "2025-10-22",
      time: "2:30 PM",
      status: "Upcoming",
    },
    {
      id: 3,
      clinic: "City Specialists Hospital",
      doctor: "Dr. Ann K.",
      service: "Dermatology",
      date: "2025-09-01",
      time: "1:00 PM",
      status: "Completed",
    },
  ],
  healthEducation: [
    {
      id: 1,
      title: "Disease Prevention",
      subtitle: "Understanding Malaria Prevention",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Nutrition",
      subtitle: "Nutrition Tips for Healthy Living",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Mental Health",
      subtitle: "Mental Health Awareness",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "First Aid Basics",
      subtitle: "Handling common injuries",
      readTime: "8 min read",
    },
  ],
};

// Component for a single Upcoming Appointment row
const AppointmentRow = ({ clinic, doctor, service, date, time }) => (
  <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
    <div className="flex items-start space-x-4">
      <BriefcaseMedical className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-800">{clinic}</h4>
        <p className="text-sm text-gray-600">
          {doctor} • {service}
        </p>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {date} @ {time}
        </div>
      </div>
    </div>
    <button className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition mt-3 sm:mt-0">
      Details
    </button>
  </div>
);

// Component for a single Health Education card (UPDATED)
const EducationCard = ({ title, subtitle, readTime }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 h-full flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-green-400 hover:scale-[1.02]">
    <div>
      <h4 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
        {title}
      </h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subtitle}</p>
    </div>
    <div className="text-xs text-gray-500 font-medium flex items-center mt-2">
      <BookOpen className="w-3 h-3 mr-1" />
      {readTime}
    </div>
  </div>
);

const PatientDashboard = () => {
  const upcomingAppointments = patientData.upcomingAppointments.filter(
    (a) => a.status === "Upcoming"
  );

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Welcome back, {patientData.fullName.split(" ")[0]}!
        </h1>
        <p className="text-lg text-gray-600">Here's your health overview</p>
      </div>

      {/* 1. Health Overview Stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {patientData.stats.map((stat) => (
            <PatientStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2. Main Content Grid (Left: Actions/Appointments, Right: Profile/Reminders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Appointments (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                title="Find Clinics"
                description="Search for healthcare providers near you"
                icon={MapPin}
                onClick={() => console.log("Navigate to Find Clinics")}
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
              <QuickActionCard
                title="Symptom Checker"
                description="Check your symptoms with AI assistance"
                icon={Heart} // Using heart here as per the user's JSX for a quick action
                onClick={() => console.log("Navigate to Symptom Checker")}
                iconColor="text-red-600"
                iconBg="bg-red-100"
              />
              <QuickActionCard
                title="Health Tips"
                description="Read articles and health education"
                icon={BookOpen}
                onClick={() => console.log("Navigate to Health Tips")}
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700 transition duration-150">
                View All
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((appointment) => (
                <AppointmentRow key={appointment.id} {...appointment} />
              ))}
              {upcomingAppointments.length === 0 ? (
                <p className="text-gray-500 pt-4">
                  No upcoming appointments scheduled.
                </p>
              ) : (
                <p className="text-sm text-gray-400 pt-4">
                  Showing {upcomingAppointments.length} upcoming appointment(s).
                  See all for history.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile, Reminders, Contacts (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500 text-white font-bold text-2xl rounded-full flex items-center justify-center mb-4">
              {patientData.profileInitials}
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {patientData.fullName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{patientData.email}</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-150 bg-blue-50 px-4 py-2 rounded-lg">
              View Profile
            </button>
          </div>

          {/* Health Reminder */}
          <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 shadow-md">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">Health Reminder</h4>
            </div>
            <p className="text-sm text-green-700 mb-4">
              Don't forget your **annual checkup** is coming up soon!
            </p>
            <button className="w-full text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md font-medium">
              Book Now
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Emergency Contacts
            </h4>

            <div className="space-y-3">
              {/* Hotline */}
              <div className="p-3 bg-red-50 rounded-lg flex items-center justify-between border-l-4 border-red-400">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">
                      Emergency Hotline
                    </p>
                    <p className="text-sm text-red-600">999</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border-l-4 border-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      AfyaLink Support
                    </p>
                    <p className="text-sm text-gray-600">+254 700 000 000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Health Education Section */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Health Education</h2>
          <button className="text-sm font-medium text-green-600 hover:text-green-700 transition duration-150">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {patientData.healthEducation.map((article) => (
            <EducationCard key={article.id} {...article} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default PatientDashboard;
