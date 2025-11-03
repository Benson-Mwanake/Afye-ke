import React from "react";
import { ArrowRight } from "lucide-react";

const ActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  colorClass = "text-green-600",
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-md text-left w-full transition duration-150 ease-in-out transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between">
        {/* The icon container uses green-50 as a default background */}
        <div className={`p-3 rounded-xl bg-green-50 ${colorClass}`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 mt-1" />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
};

export default ActionCard;
