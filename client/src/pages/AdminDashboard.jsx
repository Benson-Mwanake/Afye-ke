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
  Server,
  Database,
  Zap,
  Activity,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react";

// --- START: Dependency Definitions (Required for consolidation) ---

// Mock navigation items for the Admin
const adminNavItems = [
  {
    name: "Dashboard",
    path: "/admin-dashboard",
    icon: LayoutDashboard,
    current: true,
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
  { name: "Reports", path: "/admin-reports", icon: BarChart2, current: false },
];

// 1. AdminDashboardLayout Component (Reusable)
const AdminDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/admin/dashboard"; // Hardcode current path

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

// 2. Admin Stat Card Component
const AdminStatCard = ({ title, value, icon: Icon, colorClass, growth }) => {
  const isGood = growth === "good";

  return (
    <div
      className={`${colorClass} p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl text-white flex flex-col justify-between h-full`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium opacity-80">{title}</h3>
        <div className="p-2 rounded-full bg-white bg-opacity-20">
          {/* The trend icon (graph) is fixed for design coherence */}
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-5xl font-extrabold">{value}</p>
    </div>
  );
};

// 3. Status Badge Helper
const StatusBadge = ({ status }) => {
  let color = "";
  let text = "";
  if (status === "pending") {
    color = "bg-yellow-100 text-yellow-700";
    text = "Pending";
  } else if (status === "approved") {
    color = "bg-green-100 text-green-700";
    text = "Approved";
  } else if (status === "published") {
    color = "bg-blue-100 text-blue-700";
    text = "Published";
  } else if (status === "active") {
    color = "bg-indigo-100 text-indigo-700";
    text = "Active";
  } else if (status === "new") {
    color = "bg-red-100 text-red-700";
    text = "New";
  }

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${color} uppercase tracking-wider`}
    >
      {text}
    </span>
  );
};

// Mock Data
const adminData = {
  stats: [
    {
      title: "Total Users",
      value: "3,842",
      icon: Users,
      colorClass: "bg-green-600",
      growth: "good",
    },
    {
      title: "Registered Clinics",
      value: "144",
      icon: BriefcaseMedical,
      colorClass: "bg-blue-500",
      growth: "good",
    },
    {
      title: "Total Appointments",
      value: "1,248",
      icon: Calendar,
      colorClass: "bg-green-600",
      growth: "good",
    },
    {
      title: "Pending Approvals",
      value: "5",
      icon: Clock,
      colorClass: "bg-red-500",
      growth: "bad",
    },
  ],
  pendingApprovals: [
    {
      id: 1,
      name: "Kisumu Medical Centre",
      details: "Kisumu County • Submitted 2 hours ago",
    },
    {
      id: 2,
      name: "Eldoret Health Services",
      details: "Eldoret County • Submitted 1 day ago",
    },
    {
      id: 3,
      name: "Machakos Family Clinic",
      details: "Machakos County • Submitted 2 days ago",
    },
  ],
  recentActivity: [
    {
      type: "New clinic registration",
      description: "Kisumu Medical Centre",
      time: "2 hours ago",
      icon: BriefcaseMedical,
      status: "pending", // pending for new registration
    },
    {
      type: "Article published",
      description: "Understanding Malaria Prevention",
      time: "5 hours ago",
      icon: ClipboardList,
      status: "published",
    },
    {
      type: "Clinic approved",
      description: "Nakuru Health Center",
      time: "1 day ago",
      icon: BriefcaseMedical,
      status: "approved",
    },
    {
      type: "45 new users",
      description: "User signups",
      time: "1 day ago",
      icon: UserPlus,
      status: "active",
    },
  ],
  quickActions: [
    { label: "Review Approvals (5)", icon: Check, path: "/admin/approvals" },
    { label: "Manage Articles", icon: ClipboardList, path: "/admin/articles" },
    { label: "View Reports", icon: BarChart2, path: "/admin/reports" },
  ],
  systemHealth: {
    serverStatus: "Healthy",
    database: "Optimal",
    apiResponse: "Good",
  },
  platformOverview: {
    activeToday: "2,341 users",
    newThisWeek: "156 users",
    avgResponseTime: "1.2s",
    uptime: "99.8%",
  },
  countyStatistics: [
    { county: "Nairobi", users: 1240, clinics: 45, growth: "12%" },
    { county: "Mombasa", users: 856, clinics: 32, growth: "12%" },
    { county: "Kisumu", users: 624, clinics: 28, growth: "12%" },
    { county: "Nakuru", users: 512, clinics: 21, growth: "12%" },
    { county: "Eldoret", users: 445, clinics: 18, growth: "12%" },
  ],
};

const AdminDashboard = () => {
  // Helper to determine system health bar color and value text
  const getSystemStatus = (status) => {
    let percentage = 100;
    let color = "bg-green-500";
    if (status === "Optimal" || status === "Healthy") {
      percentage = 100;
      color = "bg-green-500";
    } else if (status === "Good") {
      percentage = 80;
      color = "bg-blue-500";
    } else if (status === "Warning") {
      percentage = 60;
      color = "bg-yellow-500";
    } else if (status === "Critical") {
      percentage = 20;
      color = "bg-red-500";
    }
    return { percentage, color };
  };

  return (
    <AdminDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">County Health Officer Overview</p>
      </div>

      {/* 1. Statistics Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminData.stats.map((stat) => (
            <AdminStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2. Main Content Grid (Left: Approvals & Activity, Right: Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Clinic Approvals */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Pending Clinic Approvals
              </h2>
              <button className="text-sm font-medium text-green-600 hover:text-green-700 transition duration-150 flex items-center">
                View All
                <span className="ml-1 text-xs">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {adminData.pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </div>
                  <button className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition duration-150">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="divide-y divide-gray-100">
              {adminData.recentActivity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="py-4 flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.type}:{" "}
                        <span className="font-normal text-gray-600">
                          {item.description}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {adminData.quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.path}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition duration-150 text-gray-700"
                  >
                    <Icon className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              System Health
            </h2>
            <div className="space-y-4">
              {Object.entries(adminData.systemHealth).map(([key, value]) => {
                const { percentage, color } = getSystemStatus(value);
                const Icon =
                  key === "serverStatus"
                    ? Server
                    : key === "database"
                    ? Database
                    : Zap;
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <Icon className="w-4 h-4 mr-2 text-gray-500" />
                        {label}
                      </span>
                      <span className={`${color.replace("bg", "text")}`}>
                        {value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Platform Overview
            </h2>
            <div className="space-y-3">
              {Object.entries(adminData.platformOverview).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1"
                  >
                    <span className="text-sm text-gray-600">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. County Statistics Table */}
      <section className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          County Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  County
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clinics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                  Growth
                  <ChevronDown className="w-3 h-3 ml-1" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminData.countyStatistics.map((item) => (
                <tr key={item.county} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.county}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.users.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.clinics}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                    {item.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
