import React from "react";
import {
  MapPin,
  Star,
  Phone,
  BriefcaseMedical,
  Clock,
  Plus,
} from "lucide-react";

const ClinicCard = ({ clinic }) => {
  const is24hr = clinic.hours === "24/7";
  const isOpen = clinic.status === "Open";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition duration-200">
      {/* Header and Status */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{clinic.name}</h3>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {clinic.status}
        </span>
      </div>

      {/* Location and Distance */}
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <MapPin className="w-4 h-4 mr-2 text-green-500" />
        <span>
          {clinic.location} • {clinic.distance}
        </span>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center text-sm mb-4">
        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold text-gray-800">{clinic.rating}</span>
        <span className="text-gray-500 ml-1">({clinic.reviews})</span>
      </div>

      {/* Operating Hours */}
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <Clock className="w-4 h-4 mr-2 text-blue-500" />
        {is24hr ? (
          <span className="font-medium text-blue-600">Open 24/7</span>
        ) : (
          <span>
            Closes {clinic.hours} {isOpen ? `(${clinic.closesIn})` : ""}
          </span>
        )}
      </div>

      {/* Services Tagline */}
      <div className="flex items-center space-x-2 flex-wrap mb-4 border-t pt-3">
        {clinic.services.slice(0, 3).map((service, index) => (
          <span
            key={index}
            className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full mb-1"
          >
            {service}
          </span>
        ))}
        {clinic.services.length > 3 && (
          <span className="text-xs font-medium text-gray-500 px-2 py-1 rounded-full mb-1">
            +{clinic.services.length - 3} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 mt-auto pt-3 border-t border-gray-100">
        <button className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-150 shadow-md">
          <BriefcaseMedical className="w-4 h-4 mr-1" /> View Details
        </button>
        <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition duration-150">
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ClinicCard;
