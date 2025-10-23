import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Heart, CheckCircle } from "lucide-react";
import Navbar from "../layouts/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient"); // Default role
  const [loading, setLoading] = useState(false);

  // Placeholder for the login action
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      console.log("Attempting login for:", { role, email, password });
      setLoading(false);
      // In a real application, navigation to the respective dashboard would happen here
    }, 1500);
  };

  const featureItems = [
    "Book appointments instantly",
    "Find trusted healthcare providers",
    "Access health education resources",
  ];

  const roles = ["Patient", "Clinic", "Admin"];

  return (
    <>
      <Navbar />
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      {/* Main Login Card - matches the rounded, elevated design */}
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

          <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
          <p className="text-lg opacity-90 mb-8">
            Sign in to access your healthcare dashboard and manage your
            appointments.
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

        {/* Right Panel: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 space-y-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-1 text-gray-500 text-sm">
              Enter your credentials to continue
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
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="you@example.com"
                  disabled={loading}
                />
                <Mail className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-green-600 hover:text-green-500 transition duration-150"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 bg-gray-50"
                  placeholder="********"
                  disabled={loading}
                />
                <Lock className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
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
                  <>Sign In</>
                )}
              </button>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm space-y-3">
              <p className="text-gray-600">
                Don't have an account?
                <Link
                  to="/signup"
                  className="font-semibold text-green-600 hover:text-green-500 transition duration-150 ml-1"
                >
                  Sign up
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

export default Login;
