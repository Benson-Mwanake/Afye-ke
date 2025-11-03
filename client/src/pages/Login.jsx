import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Heart, CheckCircle } from "lucide-react";
import Navbar from "../hooks/layouts/Navbar";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        const target =
          role === "patient"
            ? "/patient-dashboard"
            : role === "clinic"
            ? "/clinic-dashboard"
            : "/admin-dashboard";

        navigate(target);
      } else {
        alert("Invalid email or password!");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const featureItems = [
    "Book appointments instantly",
    "Find trusted healthcare providers",
    "Access health education resources",
  ];

  const roles = [
    { label: "Patient", value: "patient" },
    { label: "Clinic", value: "clinic" },
    { label: "Admin", value: "admin" },
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
            <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
            <p className="text-lg opacity-90 mb-8">
              Sign in to access your healthcare dashboard and manage your
              appointments.
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
          <div className="md:w-1/2 p-8 md:p-12 space-y-8">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-1 text-gray-500 text-sm">
                Enter your credentials to continue
              </p>
            </div>



            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email */}
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
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Password */}
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
                    className="text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                    placeholder="********"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
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
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="text-center text-sm space-y-3">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-green-600 hover:text-green-500 ml-1"
                >
                  Sign up
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

export default Login;
