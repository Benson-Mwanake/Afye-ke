import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Heart, CheckCircle, User, Phone } from "lucide-react";
import Navbar from "../hooks/layouts/Navbar";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
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
    try {
      const success = await signup(
        fullName,
        email,
        phoneNumber,
        password,
        role
      );
      if (success) {
        const target =
          role === "patient"
            ? "/patient-dashboard"
            : role === "clinic"
            ? "/clinic-dashboard"
            : "/admin-dashboard";

        navigate(target);
      } else {
        alert("User with this email already exists!");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    "Free account registration",
    "Connect with trusted clinics",
    "Manage all your health needs",
  ];

  const roles = [
    { label: "Patient", value: "patient" },
    
  ];

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left – Branding */}
          <div className="md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center bg-gradient-to-br from-green-500 to-teal-500">
            <div className="flex items-center space-x-2 mb-8">
              <Heart className="w-6 h-6 fill-white" />
              <span className="text-xl font-bold">AfyaLink</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4">
              Join AfyaLink Today
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Create your account and start your journey to better healthcare
              management.
            </p>
            <ul className="space-y-4">
              {featureItems.map((item, i) => (
                <li key={i} className="flex items-center text-md">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right – Form */}
          <div className="md:w-1/2 p-8 md:p-12 space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-1 text-gray-500 text-sm">
                Fill in your details to get started
              </p>
            </div>

            {/* Role selector */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">I am a:</p>
              <div className="flex space-x-2 border border-gray-200 rounded-xl p-1">
                {roles.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    disabled={loading}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition duration-200 ${
                      role === value
                        ? "bg-green-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  placeholder="Full Name"
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="Email Address"
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  placeholder="Phone Number"
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Password"
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Confirm Password"
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-xl text-lg font-medium text-white transition ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                } shadow-lg`}
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="text-center text-sm space-y-3">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-500 ml-1"
                >
                  Sign in
                </Link>
              </p>
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1"
              >
                <span className="text-lg leading-none">Back to home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
