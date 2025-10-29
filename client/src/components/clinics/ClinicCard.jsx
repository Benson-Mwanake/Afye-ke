// src/components/clinics/ClinicCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Phone, BriefcaseMedical, Clock } from "lucide-react";

const ClinicCard = ({ clinic }) => {
  const navigate = useNavigate();

  const is24hr = clinic.is24h;
  const isOpen = clinic.status === "Open";
  const services = Array.isArray(clinic.services) ? clinic.services : [];

  const handleDetailsClick = () => {
    navigate(`/clinic/${clinic.id}`);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {clinic.name}
        </h3>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* Location + Distance */}
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <MapPin className="w-4 h-4 mr-2 text-teal-500" />
        <span className="flex-1 truncate">
          {clinic.location} • {clinic.distance}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center text-sm mb-3">
        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
        <span className="font-medium text-gray-800">{clinic.rating}</span>
        <span className="text-gray-500 ml-1">({clinic.reviews} reviews)</span>
      </div>

      {/* Operating Hours – SAFE */}
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <Clock className="w-4 h-4 mr-2 text-indigo-500" />
        <span>
          {is24hr ? (
            <span className="font-medium text-indigo-600">Open 24/7</span>
          ) : (
            `Closes at ${clinic.hours}`
          )}
        </span>
      </div>

      {/* Services */}
      <div className="flex flex-wrap gap-2 mb-4 border-t pt-3">
        {services.slice(0, 3).map((s, i) => (
          <span
            key={i}
            className="bg-gray-50 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
          >
            {s}
          </span>
        ))}
        {services.length > 3 && (
          <span className="bg-gray-50 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
            +{services.length - 3} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2 mt-auto pt-3 border-t border-gray-200">
        <button
          onClick={handleDetailsClick}
          className="flex-1 flex items-center justify-center bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition duration-200 shadow-sm"
        >
          <BriefcaseMedical className="w-4 h-4 mr-1" /> Details
        </button>
        <a
          href={`tel:${clinic.phone}`}
          className="flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default ClinicCard;
