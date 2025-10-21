import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white text-blue-600 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          AfyaLink <span className="text-blue-500">KE</span>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/clinics"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            Clinics
          </NavLink>
          <NavLink
            to="/education"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            Health Education
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `hover:text-blue-500 transition ${
                isActive ? 'text-blue-500 font-semibold' : ''
              }`
            }
          >
            Profile
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-blue-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-50 text-blue-700 font-medium space-y-2 px-4 py-3 shadow-inner">
          <Link onClick={toggleMenu} to="/">Home</Link>
          <Link onClick={toggleMenu} to="/about">About</Link>
          <Link onClick={toggleMenu} to="/clinics">Clinics</Link>
          <Link onClick={toggleMenu} to="/education">Health Education</Link>
          <Link onClick={toggleMenu} to="/contact">Contact</Link>
          <Link onClick={toggleMenu} to="/profile">Profile</Link>
        </div>
      )}
    </nav>
  )
}
