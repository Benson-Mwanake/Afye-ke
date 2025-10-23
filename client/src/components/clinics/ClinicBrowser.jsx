import React, { useState } from "react";
import { Search, MapPin, Star, Clock } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ClinicCard from "./ClinicCard";

// Mock Data for Clinics
const mockClinics = [
  {
    name: "Nairobi Health Center",
    location: "Westlands, Nairobi",
    distance: "2.5 km",
    rating: "4.8",
    reviews: 124,
    status: "Open",
    hours: "8:00 PM",
    services: ["General Practice", "Pediatrics", "Laboratory"],
  },
  {
    name: "Mombasa Community Clinic",
    location: "Nyali, Mombasa",
    distance: "5.8 km",
    rating: "4.6",
    reviews: 98,
    status: "Open",
    hours: "6:00 PM",
    services: ["Maternity", "Laboratory", "Dental"],
  },
  {
    name: "Kisumu Medical Centre",
    location: "Town Centre, Kisumu",
    distance: "3.2 km",
    rating: "4.9",
    reviews: 156,
    status: "Open",
    hours: "9:00 PM",
    services: ["Dental", "Pharmacy", "X-Ray"],
  },
  {
    name: "Westlands Family Health",
    location: "Westlands, Nairobi",
    distance: "1.8 km",
    rating: "4.7",
    reviews: 89,
    status: "Closed",
    hours: "8:00 AM",
    services: ["Family Medicine", "Pediatrics", "Vaccination"],
  },
  {
    name: "Nakuru Central Hospital",
    location: "CBD, Nakuru",
    distance: "4.1 km",
    rating: "4.5",
    reviews: 72,
    status: "Open",
    hours: "7:00 PM",
    services: ["Emergency", "Surgery", "ICU"],
  },
  {
    name: "Eldoret Community Care",
    location: "Eldoret Town",
    distance: "6.5 km",
    rating: "4.8",
    reviews: 110,
    status: "Open",
    hours: "8:30 PM",
    services: ["Outpatient", "Maternity", "Laboratory"],
  },
];

const ClinicBrowser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Nearest First");

  const filters = [
    "Nearest First",
    "Highest Rated",
    "Open Now",
    "24/7 Services",
  ];

  const filteredClinics = mockClinics
    .filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (activeFilter === "Highest Rated")
        return parseFloat(b.rating) - parseFloat(a.rating);
      // Basic distance sort based on mock data (assumes distance is number + ' km')
      if (activeFilter === "Nearest First")
        return parseFloat(a.distance) - parseFloat(b.distance);
      if (activeFilter === "Open Now") return b.status === "Open" ? 1 : -1;
      if (activeFilter === "24/7 Services") return b.hours === "24/7" ? 1 : -1;
      return 0;
    });

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Find Healthcare Providers
        </h1>
        <p className="text-lg text-gray-500">
          Discover trusted clinics and healthcare centers near you
        </p>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-200 flex items-center max-w-4xl mx-auto mb-8">
        <Search className="w-5 h-5 ml-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by clinic name or location..."
          className="w-full px-4 py-3 text-gray-700 outline-none rounded-r-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10 max-w-4xl mx-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
              activeFilter === filter
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-6 max-w-4xl mx-auto">
        Found {filteredClinics.length} healthcare providers
      </p>

      {/* Clinic Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {filteredClinics.length > 0 ? (
          filteredClinics.map((clinic, index) => (
            <ClinicCard key={index} clinic={clinic} />
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-10 bg-white rounded-xl shadow-md border border-gray-100">
            <MapPin className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-xl text-gray-600">
              No clinics found matching your criteria.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClinicBrowser;
