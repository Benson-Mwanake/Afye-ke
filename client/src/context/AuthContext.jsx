// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  // --- 1. INITIAL USER + TOKEN LOAD ---
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
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
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to parse stored user or token missing:", err);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  // --- 2. LOAD ALL USERS (Admin only) ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) return;
        const res = await fetch("http://127.0.0.1:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.warn("Could not load all users via API.", err);
      }
    };
    if (!loading && user?.role === "admin") fetchUsers();
  }, [loading, user, token]);

  // --- 3. REFRESH USER ---
  const refreshUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) return false;

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/profile", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) throw new Error("Failed to refresh user");
      const updatedUser = await res.json();
      const userObj = {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        clinicId: updatedUser.clinicId,
        profile: updatedUser.profile || {},
        savedClinics: updatedUser.savedClinics || [],
      };
      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      return true;
    } catch (err) {
      console.error("Refresh user failed:", err);
      return false;
    }
  };

  // --- 4. LOGIN ---
  const login = async (emailOrObj, password, role) => {
    if (typeof emailOrObj === "object" && !password && !role) {
      const userObj = emailOrObj;
      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      return true;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrObj, password, role }),
      });
      if (!res.ok) throw new Error("Login failed");
      const { access_token, user: u } = await res.json();

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

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      setToken(access_token);
      setUser(userObj);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  // --- 5. SIGNUP ---
  const signup = async (fullName, email, phoneNumber, password, role) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          password,
          role,
        }),
      });
      if (!res.ok) throw new Error("Signup failed");
      const { access_token, user: u } = await res.json();

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

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      setToken(access_token);
      setUser(userObj);
      return true;
    } catch (err) {
      console.error("Signup failed", err);
      return false;
    }
  };

  // --- 6. TOGGLE SAVED CLINIC ---
  const toggleSavedClinic = async (clinicId) => {
    if (!user || user.role !== "patient") return false;

    const saved = user.savedClinics || [];
    const isSaved = saved.includes(clinicId);
    const updatedSaved = isSaved
      ? saved.filter((id) => id !== clinicId)
      : [...new Set([...saved, clinicId])];

    try {
      if (!token) return false;

      const res = await fetch(`http://127.0.0.1:5000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ saved_clinics: updatedSaved }),
      });
      if (!res.ok) throw new Error("Failed to update saved clinics");
      const updatedUser = await res.json();
      login(updatedUser);
      return true;
    } catch (err) {
      console.error("toggleSavedClinic error:", err);
      return false;
    }
  };

  // --- 7. LOGOUT ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Expose setUser
        token,
        loading,
        login,
        signup,
        logout,
        allUsers,
        toggleSavedClinic,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
