import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../hooks/layouts/Navbar";
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  Star,
} from "lucide-react";

// Reusable component for the Feature blocks (Why Choose AfyaLink?)
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-lg h-full flex flex-col items-center text-center"
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 40 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="bg-green-50 text-green-600 p-3 rounded-full mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-500 text-sm">{description}</p>
  </motion.div>
);

// Reusable component for the Clinic Cards
const ClinicCard = ({ name, location, service, rating, onView }) => (
  <motion.div
    className="bg-white p-4 rounded-xl border border-gray-200 h-full flex flex-col justify-between"
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 40 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{name}</h4>
      <div className="flex items-center text-gray-500 text-sm space-x-1 mb-1">
        <MapPin className="w-4 h-4 text-green-500" />
        <span>{location}</span>
      </div>
      <div className="text-green-600 text-xs font-medium mb-3">{service}</div>
    </div>

    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center space-x-1 text-yellow-500 text-sm">
        <Star className="w-4 h-4 fill-yellow-500" />
        <span>{rating}</span>
      </div>
      <button
        onClick={onView}
        className="text-sm font-semibold text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition duration-150"
      >
        View Details
      </button>
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      alert("Please enter a location or clinic name to search.");
    } else {
      alert(`Searching for clinics near "${searchQuery}"...`);
      // Later: navigate(`/clinics?query=${searchQuery}`)
    }
  };

  const handleViewDetails = (clinicName) => {
    alert(`Opening details for ${clinicName}...`);
    // Later: navigate(`/clinics/${id}`)
  };

  return (
    <main>
      <Navbar />

      {/* 1. Hero Section */}
      <section
        className="relative pt-24 pb-20 overflow-hidden min-h-[500px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513224502586-d1e602410265?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvc3BpdGFsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/80 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Quality Healthcare,{" "}
              <span className="text-green-600">Connected</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connecting patients, clinics, and county health officers across
              Kenya. Find trusted healthcare providers near you.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-xl bg-white p-1 rounded-xl shadow-lg border border-gray-200 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Find Clinics Near You..."
              className="w-full px-4 py-3 text-gray-700 outline-none rounded-l-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition duration-150"
            >
              <Search className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="mt-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-150 shadow-md"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 px-6 py-3 rounded-lg font-semibold hover:text-green-600 transition duration-150"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Why Choose AfyaLink? */}
      <section className="py-20 bg-gray-50">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Why Choose AfyaLink?
          </h2>
          <p className="text-xl text-gray-500 mb-12">
            Your health, simplified and connected
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="Find Clinics"
              description="Discover trusted healthcare providers near you across all counties in Kenya"
            />
            <FeatureCard
              icon={Calendar}
              title="Book Appointments"
              description="Schedule visits easily and manage your healthcare appointments in one place"
            />
            <FeatureCard
              icon={Heart}
              title="Health Education"
              description="Access reliable health information and resources vetted by healthcare professionals"
            />
          </div>
        </motion.div>
      </section>

      {/* 3. Featured Clinics */}
      <section className="py-20 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Featured Clinics
          </h2>
          <p className="text-xl text-gray-500 mb-12">
            Top-rated healthcare providers in your area
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ClinicCard
              name="Nairobi Health Center"
              location="Nairobi County"
              service="General Practice, Pediatrics"
              rating="4.8"
              onView={() => handleViewDetails("Nairobi Health Center")}
            />
            <ClinicCard
              name="Mombasa Community Clinic"
              location="Mombasa County"
              service="Maternity, Laboratory"
              rating="4.6"
              onView={() => handleViewDetails("Mombasa Community Clinic")}
            />
            <ClinicCard
              name="Kisumu Medical Centre"
              location="Kisumu County"
              service="Dental, Pharmacy"
              rating="4.9"
              onView={() => handleViewDetails("Kisumu Medical Centre")}
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;
