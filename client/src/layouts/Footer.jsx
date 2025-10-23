import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Find Clinics", href: "/clinics" },
    { name: "Health Tips", href: "/education" },
  ];

  const providerLinks = [
    { name: "Register Clinic", href: "/register-clinic" },
    { name: "Provider Login", href: "/login/provider" },
    { name: "Resources", href: "/resources" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Logo and Tagline */}
          <div>
            <div className="flex items-center text-xl font-bold text-green-400 mb-4">
              <svg
                className="w-8 h-8 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AfyaLink
            </div>
            <p className="text-gray-400 text-sm">
              Connecting healthcare across Kenya.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h5>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition duration-150 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Providers */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              For Providers
            </h5>
            <ul className="space-y-3">
              {providerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition duration-150 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contact
            </h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3 text-green-400" />
                +254 700 000 000
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-green-400" />
                info@afyalink.co.ke
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="w-4 h-4 mr-3 mt-1 text-green-400 flex-shrink-0" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; 2025 AfyaLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
