// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Axios instance configured to send the JWT token

// The API_URL constant for the mock server is no longer needed
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // NOTE: Keeping allUsers for compatibility, but security checks are now handled
  // by the secure backend /auth endpoints.
  const [allUsers, setAllUsers] = useState([]);

  // --- 1. INITIAL USER LOAD ---
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("authToken"); // Check for the JWT token

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);

        // Use the stored complete user object and ensure defaults are safe
        setUser({
          ...parsed,
          profile: parsed.profile || {
            dob: "",
            gender: "",
            country: "",
            bloodType: "",
            allergies: "",
            emergencyContact: "",
          },
          savedClinics: parsed.savedClinics || [],
        });
      } catch (err) {
        console.error("Failed to parse stored user or token missing:", err);
        // Clear session data if parsing fails
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  // --- 2. LOAD ALL USERS (Optional for the new backend) ---
  useEffect(() => {
    const fetchUsers = async () => {
      // NOTE: Using 'api.get' requires a valid JWT. This fetch might fail if
      // the user is logged out, which is now expected behavior for a secure app.
      try {
        const res = await api.get("/users");
        setAllUsers(res.data);
      } catch (err) {
        console.warn(
          "Could not load all users via API. This may be expected if endpoint is protected and user is not authenticated.",
          err
        );
      }
    };
    // Fetch users if we detect a logged-in user
    if (!loading && user) {
      fetchUsers();
    }
  }, [loading, user]);

  // --- 3. SECURE LOGIN IMPLEMENTATION (JWT INTEGRATION) ---
  const login = async (emailOrObj, password, role) => {
    // Case 1: Full user object (from internal updates, like toggleSavedClinic)
    if (typeof emailOrObj === "object" && !password && !role) {
      const userObj = emailOrObj;
      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      return true;
    }

    // Case 2: Secure JWT Login with email/password (Replaced mock API logic)
    try {
      const res = await api.post("/auth/login", {
        email: emailOrObj,
        password,
        role: role, // Ensure role is passed for server validation
      });

      // Server returns access_token and user object 'u'
      const { access_token, user: u } = res.data;

      // 1. Store the JWT token for future authenticated requests
      localStorage.setItem("authToken", access_token);

      // 2. Map and store the user object using new camelCase fields
      const userObj = {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        clinicId: u.clinicId,
        profile: u.profile || {},
        savedClinics: u.savedClinics || [],
      };

      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      return true;
    } catch (err) {
      console.error("Login failed", err);
      // Log the error message from the backend response (safer than alert)
      console.log(
        "Login Error:",
        err.response?.data?.msg ||
          "Login failed due to network error or invalid credentials."
      );
      return false;
    }
  };

  // --- 4. SECURE SIGNUP IMPLEMENTATION (JWT INTEGRATION) ---
  const signup = async (fullName, email, phoneNumber, password, role) => {
    // Removed all frontend checks and clinic creation logic.
    // The secure backend handles email uniqueness, user creation, and clinic creation atomically.

    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        phoneNumber,
        password,
        role,
      });

      // Server returns access_token and the newly created user object 'u'
      const { access_token, user: u } = res.data;

      // 1. Store the JWT token
      localStorage.setItem("authToken", access_token);

      // 2. Map and store the user object
      const userObj = {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        clinicId: u.clinicId,
        profile: u.profile || {},
        savedClinics: u.savedClinics || [],
      };

      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));

      return true;
    } catch (err) {
      console.error("Signup failed", err);
      // Log the error message from the backend response
      console.log(
        "Signup Error:",
        err.response?.data?.msg || "Signup failed. Please check your data."
      );
      return false;
    }
  };

  // --- 5. TOGGLE SAVED CLINIC (Using secure 'api' instance) ---
  const toggleSavedClinic = async (clinicId) => {
    if (!user || user.role !== "patient") return false;

    const saved = user.savedClinics || [];
    const isSaved = saved.includes(clinicId);
    const updatedSaved = isSaved
      ? saved.filter((id) => id !== clinicId)
      : [...new Set([...saved, clinicId])];

    try {
      // Use the 'api' instance (Axios) which automatically includes the JWT token
      const res = await api.patch(`/users/${user.id}`, {
        savedClinics: updatedSaved,
      });

      // The response already contains the updated user object
      const updatedUser = res.data;

      const fullUser = {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        clinicId: updatedUser.clinicId,
        profile: updatedUser.profile || {},
        savedClinics: updatedUser.savedClinics || [],
      };

      // Use the overloaded login function to safely update local state and storage
      login(fullUser);
      return true;
    } catch (err) {
      console.error("toggleSavedClinic error:", err);
      console.log(
        "Toggle Clinic Error:",
        err.response?.data?.msg || "Failed to update saved clinics."
      );
      return false;
    }
  };

  // --- 6. LOGOUT (Clearing both user and token) ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken"); // Critical for JWT sessions
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    allUsers,
    toggleSavedClinic,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
