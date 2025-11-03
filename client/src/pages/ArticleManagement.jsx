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
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  Zap, // For views
  BookOpen, // For categories
} from "lucide-react";


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
    current: true,
  },
  { name: "Reports", path: "/admin-reports", icon: BarChart2, current: false },
];

// 1. AdminDashboardLayout Component (Reusable)
const AdminDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = "/admin/articles"; 

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

// 2. Article Stat Card Component
const ArticleStatCard = ({ title, value, colorClass, icon: Icon }) => {
  return (
    <div
      className={`p-8 rounded-xl shadow-lg ${colorClass} text-white transition-shadow duration-300 hover:shadow-xl flex justify-between items-center h-full`}
    >
      <div>
        <p className="text-5xl font-bold mb-1">{value}</p>
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
      </div>
      {Icon && <Icon className="w-10 h-10 opacity-70" />}
    </div>
  );
};

// 3. Status Badge Helper
const StatusBadge = ({ status }) => {
  let color = "";
  let text = status;
  if (status === "published") {
    color = "bg-green-100 text-green-700";
  } else if (status === "draft") {
    color = "bg-blue-100 text-blue-700";
  } else if (status === "pending") {
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${color} capitalize tracking-wider`}
    >
      {text}
    </span>
  );
};

// 4. Category Tag Helper
const CategoryTag = ({ category }) => {
  const hash = category.length % 5;
  let color = "";
  if (hash === 0) color = "bg-purple-100 text-purple-700";
  else if (hash === 1) color = "bg-indigo-100 text-indigo-700";
  else if (hash === 2) color = "bg-pink-100 text-pink-700";
  else if (hash === 3) color = "bg-teal-100 text-teal-700";
  else color = "bg-orange-100 text-orange-700";

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${color}`}>
      {category}
    </span>
  );
};

const articleData = {
  stats: [
    {
      title: "Published Articles",
      value: 4,
      colorClass: "bg-green-600",
      icon: FileText,
    },
    {
      title: "Drafts",
      value: 1,
      colorClass: "bg-blue-600",
      icon: Edit,
    },
    {
      title: "Total Views",
      value: "4,070",
      colorClass: "bg-red-600",
      icon: Zap,
    },
    {
      title: "Categories",
      value: 6,
      colorClass: "bg-purple-600",
      icon: BookOpen,
    },
  ],
  articles: [
    {
      id: 1,
      title: "Understanding Malaria Prevention in Kenya",
      category: "Disease Prevention",
      author: "Dr. Jane Mwangi",
      date: "2025-10-10",
      views: 1248,
      status: "published",
    },
    {
      id: 2,
      title: "Nutrition Tips for Healthy Living",
      category: "Nutrition",
      author: "Dr. Peter Kamau",
      date: "2025-10-08",
      views: 956,
      status: "published",
    },
    {
      id: 3,
      title: "Mental Health Awareness and Support",
      category: "Mental Health",
      author: "Dr. Sarah Ochieng",
      date: "2025-10-05",
      views: 742,
      status: "published",
    },
    {
      id: 4,
      title: "Maternal Health: Pre-natal Care Guide",
      category: "Maternal Health",
      author: "Dr. Mary Wanjiku",
      date: "2025-10-03",
      views: 0,
      status: "draft",
    },
    {
      id: 5,
      title: "Child Immunization Schedule",
      category: "Child Health",
      author: "Dr. James Otieno",
      date: "2025-09-28",
      views: 1124,
      status: "published",
    },
  ],
};

const ArticleManagement = () => {
  const [articles, setArticles] = useState(articleData.articles);

  const handleAction = (id, action) => {
    if (action === "Delete") {
      setArticles(articles.filter((article) => article.id !== id));
      console.log(`Article ID ${id} deleted.`);
    } else {
      console.log(`${action} Article ID ${id}`);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Article Management
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage health education content
          </p>
        </div>
        <button className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Article
        </button>
      </div>

      {/* 1. Statistics Cards (NOW COLORED AND LARGER) */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {articleData.stats.map((stat) => (
            <ArticleStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* 2. Article Table */}
      <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
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
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                        {article.title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CategoryTag category={article.category} />
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.author}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.date}
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {article.views.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={article.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-gray-500 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition"
                          onClick={() => handleAction(article.id, "View")}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition"
                          onClick={() => handleAction(article.id, "Edit")}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition"
                          onClick={() => handleAction(article.id, "Delete")}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-lg text-gray-500"
                  >
                    No articles found. Time to create some great content!
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

export default ArticleManagement;
