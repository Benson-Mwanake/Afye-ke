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
  TrendingUp,
  Smile,
  Zap,
  BookOpen,
  Download,
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items for the Admin, marking "Reports" as current
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
    current: false,
  },
  {
    name: "Articles",
    path: "/manage-articles",
    icon: ClipboardList,
    current: false,
  },
  { name: "Reports", path: "/admin-reports", icon: BarChart2, current: true },
];

// 1. AdminDashboardLayout Component (Reusable)
const AdminDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/admin/reports"; // Set current path to Reports

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

// 2. Report Stat Card Component
const ReportStatCard = ({ title, value, detail, colorClass, trend }) => {
  const TrendIcon = trend === "increase" ? TrendingUp : TrendingUp; // Using TrendingUp for both for simplicity, green/red will differentiate

  return (
    <div
      className={`p-6 rounded-xl shadow-lg ${colorClass} text-white transition-shadow duration-300 hover:shadow-xl flex flex-col justify-between h-full`}
    >
      <div className="flex justify-end mb-2">
        <TrendIcon className="w-5 h-5 opacity-70" />
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <h3 className="text-md font-medium opacity-90">{title}</h3>
      <p
        className={`text-sm font-semibold mt-2 ${
          trend === "increase" ? "text-white" : "text-white"
        }`}
      >
        {detail}
      </p>
    </div>
  );
};

// 3. Simple Bar Chart (Mock Component - to represent platform growth)
const PlatformGrowthChart = ({ data, title }) => {
  // Determine maximum value for scaling
  const max = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>

      {/* Chart Area */}
      <div className="flex-grow flex items-end space-x-4 border-b pb-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center group relative h-full justify-end w-full"
          >
            {/* Bar */}
            <div
              className="w-full bg-green-500 rounded-t-md hover:bg-green-600 transition-all duration-300"
              style={{ height: `${(item.value / max) * 90}%` }} // Scale bar height
            ></div>
            {/* Tooltip (Mock) */}
            <span className="absolute -top-6 text-xs text-gray-700 bg-white px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between pt-2">
        {data.map((item, index) => (
          <span
            key={index}
            className="text-xs font-medium text-gray-500 w-full text-center"
          >
            {item.month}
          </span>
        ))}
      </div>

      {/* Growth Metrics */}
      <div className="flex justify-around mt-6 border-t pt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">+15%</p>
          <p className="text-sm text-gray-500">User Growth</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">+7%</p>
          <p className="text-sm text-gray-500">Clinic Growth</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">+18%</p>
          <p className="text-sm text-gray-500">Appointments</p>
        </div>
      </div>
    </div>
  );
};

// 4. Service Utilization Component
const ServiceUtilization = ({ data }) => {
  const totalVisits = data.reduce((sum, item) => sum + item.visits, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-96">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Service Utilization
      </h2>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage =
            totalVisits > 0
              ? ((item.visits / totalVisits) * 100).toFixed(0)
              : 0;

          // Simple color palette
          let barColor = "bg-green-500";
          if (item.service === "Laboratory Services") barColor = "bg-blue-500";
          else if (item.service === "Maternity") barColor = "bg-yellow-500";
          else if (item.service === "Pediatrics") barColor = "bg-red-500";

          return (
            <div key={index}>
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <p className="font-medium">{item.service}</p>
                <div className="flex items-center space-x-3 font-semibold">
                  <span>{item.visits.toLocaleString()} visits</span>
                  <span className="text-xs text-gray-500">| {percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${barColor}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Top Performing Clinics Component
const TopPerformingClinics = ({ clinics }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Top Performing Clinics
      </h2>
      <div className="space-y-4">
        {clinics.map((clinic, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 border-b pb-3 last:border-b-0 last:pb-0"
          >
            {/* Rank Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index < 3
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              #{index + 1}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-900">{clinic.name}</p>
              <p className="text-xs text-gray-500">
                {clinic.appointments.toLocaleString()} appointments
              </p>
            </div>
            <div className="flex items-center text-sm font-semibold text-yellow-500">
              {clinic.rating} <span className="text-gray-400 ml-1">★</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock Data
const reportsData = {
  stats: [
    {
      title: "Total Users",
      value: "3,842",
      detail: "+12% from last month",
      colorClass: "bg-green-600",
      trend: "increase",
      icon: Users,
    },
    {
      title: "Active Clinics",
      value: "144",
      detail: "+4 new this month",
      colorClass: "bg-blue-600",
      trend: "increase",
      icon: BriefcaseMedical,
    },
    {
      title: "Appointments (Oct)",
      value: "1,248",
      detail: "-15% from last month",
      colorClass: "bg-green-600",
      trend: "decrease",
      icon: Calendar,
    },
    {
      title: "User Satisfaction",
      value: "98.5%",
      detail: "+2% improvement",
      colorClass: "bg-blue-600",
      trend: "increase",
      icon: Smile,
    },
  ],
  growth: [
    { month: "May", value: 3380 },
    { month: "Jun", value: 3580 },
    { month: "Jul", value: 3720 },
    { month: "Aug", value: 3850 },
    { month: "Sep", value: 3920 },
    { month: "Oct", value: 3842 },
  ],
  services: [
    { service: "General Practice", visits: 1240 },
    { service: "Laboratory Services", visits: 892 },
    { service: "Maternity", visits: 654 },
    { service: "Pediatrics", visits: 542 },
    { service: "Dental", visits: 428 },
    { service: "Other", visits: 112 },
  ],
  topClinics: [
    { name: "Nairobi Health Center", rating: 4.8, appointments: 342 },
    { name: "Mombasa Community Clinic", rating: 4.6, appointments: 298 },
    { name: "Kisumu Medical Centre", rating: 4.9, appointments: 276 },
    { name: "Nakuru Health Center", rating: 4.5, appointments: 245 },
    { name: "Eldoret Community Care", rating: 4.8, appointments: 223 },
  ],
  monthlyStats: {
    activeUsers: "3,842",
    newRegistrations: "+428",
    avgSessionDuration: "8m 32s",
    totalAppointments: "1,248",
    completed: "1,156 (93%)",
    cancelled: "92 (7%)",
    healthArticles: "45 published",
    totalArticleViews: "12,384",
    avgViewsPerArticle: "275",
  },
};

const ReportsPage = () => {
  // Determine the max value for scaling the service utilization bar widths
  const maxServiceVisits = Math.max(
    ...reportsData.services.map((s) => s.visits)
  );

  // --- Render Service Utilization with percentage calculation ---
  const renderServiceUtilization = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Service Utilization
        </h2>
        <div className="space-y-4">
          {reportsData.services.map((item, index) => {
            const totalVisits = reportsData.services.reduce(
              (sum, s) => sum + s.visits,
              0
            );
            const percentage =
              totalVisits > 0
                ? ((item.visits / totalVisits) * 100).toFixed(0)
                : 0;

            // Simple color palette
            let barColor = "bg-green-500";
            if (item.service === "Laboratory Services")
              barColor = "bg-blue-500";
            else if (item.service === "Maternity") barColor = "bg-yellow-500";
            else if (item.service === "Pediatrics") barColor = "bg-red-500";
            else if (item.service === "Dental") barColor = "bg-indigo-500";
            else if (item.service === "Other") barColor = "bg-gray-500";

            return (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <p className="font-medium">{item.service}</p>
                  <div className="flex items-center space-x-3 font-semibold">
                    <span>{item.visits.toLocaleString()} visits</span>
                    <span className="text-xs text-gray-500">
                      | {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Render Monthly Statistics Table ---
  const renderMonthlyStatistics = () => {
    const stats = reportsData.monthlyStats;
    const dataRows = [
      { label: "Active Users (Oct)", value: stats.activeUsers },
      {
        label: "New Registrations",
        value: stats.newRegistrations,
        color: "text-green-600",
      },
      { label: "Avg Session Duration", value: stats.avgSessionDuration },
      { label: "Total Appointments", value: stats.totalAppointments },
      { label: "Completed", value: stats.completed, color: "text-green-600" },
      { label: "Cancelled", value: stats.cancelled, color: "text-red-600" },
      { label: "Health Articles", value: stats.healthArticles },
      { label: "Total Article Views", value: stats.totalArticleViews },
      { label: "Avg Views per Article", value: stats.avgViewsPerArticle },
    ];

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Monthly Statistics
        </h2>
        <div className="divide-y divide-gray-100">
          {dataRows.map((row, index) => (
            <div key={index} className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">{row.label}</span>
              <span className={`font-semibold ${row.color || "text-gray-900"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Reports & Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Platform performance and insights
          </p>
        </div>
        <button className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* 1. Statistics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {reportsData.stats.map((stat) => (
            <ReportStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2 & 3. Charts and Service Utilization (Two-Column Layout) */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth Chart */}
        <PlatformGrowthChart
          data={reportsData.growth}
          title="Platform Growth"
        />

        {/* Service Utilization */}
        {renderServiceUtilization()}
      </section>

      {/* 4 & 5. Top Performing Clinics and Monthly Statistics (Two-Column Layout) */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Clinics */}
        <TopPerformingClinics clinics={reportsData.topClinics} />

        {/* Monthly Statistics */}
        {renderMonthlyStatistics()}
      </section>
    </AdminDashboardLayout>
  );
};

export default ReportsPage;
