import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Clinics", path: "/clinics" },
    { name: "Health Education", path: "/education" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white text-blue-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          AfyaLink <span className="text-blue-500">KE</span>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `hover:text-blue-500 transition ${
                  isActive ? "text-blue-500 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        </div>
    </nav>
  );
}
