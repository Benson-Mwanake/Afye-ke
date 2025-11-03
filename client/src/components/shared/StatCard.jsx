import React from "react";
// Note: Icon component is passed via props
// import { TrendingUp } from 'lucide-react'; // Not needed if passed as prop

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500" },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-500",
  },
  "dark-green": {
    bg: "bg-teal-100",
    text: "text-teal-600",
    border: "border-teal-500",
  },
  "light-blue": {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "border-indigo-500",
  },
  red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-500" },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
};

const StatCard = ({ title, value, icon: Icon, color = "blue", trendValue }) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg border-l-4 ${colors.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

      {trendValue && (
        <div className="flex items-center text-sm">
          {/* Using a simple text-based trend indicator */}
          <span className={`text-xs font-semibold ${colors.text}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
