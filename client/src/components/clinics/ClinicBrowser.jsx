import React, { useState } from "react";
import { Search, MapPin, Star, Clock } from "lucide-react";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";
import ClinicCard from "./ClinicCard";

// Mock Data for Clinics with IDs
const mockClinics = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
      if (activeFilter === "Nearest First")
        return parseFloat(a.distance) - parseFloat(b.distance);
      if (activeFilter === "Open Now") return b.status === "Open" ? 1 : -1;
      if (activeFilter === "24/7 Services") return b.hours === "24/7" ? 1 : -1;
      return 0;
    });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Explore Healthcare Providers
        </h1>
        <p className="text-md md:text-lg text-gray-500 mt-1">
          Find clinics and medical centers near you
        </p>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 flex items-center max-w-3xl mx-auto mb-6">
        <Search className="w-5 h-5 ml-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full px-4 py-2 text-gray-700 focus:outline-none rounded-r-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 max-w-3xl mx-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition duration-200 ${
              activeFilter === filter
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="text-md font-medium text-gray-700 mb-4 max-w-3xl mx-auto">
        {filteredClinics.length} providers found
      </p>

      {/* Clinic Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {filteredClinics.length > 0 ? (
          filteredClinics.map((clinic, index) => (
            <ClinicCard key={index} clinic={clinic} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-white rounded-2xl shadow-md border border-gray-100">
            <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-lg text-gray-600">
              No clinics match your search.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please try different keywords or filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClinicBrowser;
