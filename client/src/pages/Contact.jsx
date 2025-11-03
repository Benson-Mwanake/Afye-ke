import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "../hooks/layouts/Navbar";

export default function Contact() {
  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Nairobi",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // Outputs: "Thursday, 23 October 2025, 09:05 PM EAT"

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-green-700 mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? Reach out to the
            AfyaLink KE team — we’re here to help you connect to trusted
            healthcare services as of {currentDate}.
          </p>
          <div className="mt-4 text-green-600 text-sm font-medium transition-all duration-700">
            "Your Health, Our Priority."
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Send us a Message
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-gray-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center bg-gradient-to-br from-green-50/50 to-green-100 rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Get in Touch
            </h2>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">Email</p>
                <p className="text-gray-600 text-sm">support@afyalink.ke</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">Phone</p>
                <p className="text-gray-600 text-sm">+254 712 345 678</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">Location</p>
                <p className="text-gray-600 text-sm">
                  P.O. Box 12345, Nairobi, Kenya
                </p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 italic">
              We usually respond within 24 hours. Thank you for reaching out to
              AfyaLink KE.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
