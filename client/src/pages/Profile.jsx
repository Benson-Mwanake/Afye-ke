import React from "react";
import { User, Mail, Phone, MapPin, HeartPulse, Edit } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and connected health data.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#007BFF] to-blue-600 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
              <User className="w-12 h-12" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-all">
              <Edit className="w-4 h-4 text-[#007BFF]" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600 text-sm">Member since March 2025</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-[#007BFF]" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-[#007BFF]" />
                <span>+254 712 345 678</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[#007BFF]" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            <div className="pt-3">
              <button className="bg-gradient-to-br from-[#007BFF] to-blue-600 text-white px-5 py-2 rounded-xl hover:opacity-90 transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Health Stats */}
          <div className="bg-gradient-to-br from-[#007BFF]/5 to-blue-50 border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#007BFF]" /> Health Summary
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                Last Checkup:{" "}
                <span className="font-medium text-gray-800">June 2025</span>
              </li>
              <li>
                Preferred Clinic:{" "}
                <span className="font-medium text-gray-800">
                  Nairobi West Hospital
                </span>
              </li>
              <li>
                Linked CHV:{" "}
                <span className="font-medium text-gray-800">Faith Mwende</span>
              </li>
            </ul>
          </div>

          {/* Recent Appointments */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Recent Appointments
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <span className="font-medium text-gray-800">Dr. Kamau</span> —
                15 Oct 2025
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Wellness Screening
                </span>{" "}
                — 2 Sep 2025
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Nutrition Consult
                </span>{" "}
                — 12 Aug 2025
              </li>
            </ul>
          </div>

          {/* Linked Clinics */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Linked Clinics
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>✅ AfyaCare Clinic - Nyali</li>
              <li>✅ HealthBridge - Mombasa</li>
              <li>✅ CityMed Center - Nairobi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
