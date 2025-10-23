import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Heart, CheckCircle, User, Phone } from "lucide-react";
import Navbar from "../layouts/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Patient"); // Default role
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Placeholder for the signup action
  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      console.log("Attempting signup for:", {
        role,
        fullName,
        email,
        phoneNumber,
        password,
      });
      setLoading(false);
      // In a real application, navigation or state update would happen here
    }, 1500);
  };

  const featureItems = [
    "Free account registration",
    "Connect with trusted clinics",
    "Manage all your health needs",
  ];

  const roles = ["Patient", "Clinic", "Admin"];

  return (
    <>
      <Navbar />
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      {/* Main Signup Card - matches the rounded, elevated design */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel: Gradient Welcome */}
        <div
          className="md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center 
                        bg-gradient-to-br from-green-500 to-teal-500"
        >
          <div className="flex items-center space-x-2 mb-8">
            <Heart className="w-6 h-6 fill-white text-white" />
            <span className="text-xl font-bold">AfyaLink</span>
          </div>

          <h1 className="text-4xl font-extrabold mb-4">Join AfyaLink Today</h1>
          <p className="text-lg opacity-90 mb-8">
            Create your account and start your journey to better healthcare
            management.
          </p>

          {/* Feature List */}
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center text-md">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Signup Form */}
        <div className="md:w-1/2 p-8 md:p-12 space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-1 text-gray-500 text-sm">
              Fill in your details to get started
            </p>
          </div>

          {/* Role Selector */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">I am a:</p>
            <div className="flex space-x-4 border border-gray-200 rounded-xl p-1">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition duration-200 ${
                    role === r
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={loading}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="Full Name"
                  disabled={loading}
                />
                <User className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="Email Address"
                  disabled={loading}
                />
                <Mail className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="Phone Number"
                  disabled={loading}
                />
                <Phone className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="Password"
                  disabled={loading}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="Confirm Password"
                  disabled={loading}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Create Account Button */}
            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                } transition duration-150 shadow-lg`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <>Create Account</>
                )}
              </button>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm space-y-3">
              <p className="text-gray-600">
                Already have an account?
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-500 transition duration-150 ml-1"
                >
                  Sign in
                </Link>
              </p>
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 transition duration-150 flex items-center justify-center space-x-1"
              >
                <span className="text-lg leading-none">&larr;</span>
                <span>Back to home</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
