// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "http://localhost:4000";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  // Load current user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          email: parsed.email,
          role: parsed.role,
          clinicId: parsed.clinicId,
          fullName: parsed.fullName || "",
        });
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
    setLoading(false);
  }, []);

  // Load all users once (for signup checks)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.error("AuthContext → API Error:", err);
        alert(
          "Backend not running. Run: npx json-server --watch db.json --port 4000"
        );
      }
    };
    fetchUsers();
  }, []);

  // LOGIN: Always fetch fresh user data
  const login = async (email, password, role) => {
    const normalizedRole = role.toLowerCase();

    let users = [];
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      users = await res.json();
    } catch (err) {
      console.error("Login fetch error:", err);
      alert("Backend not running.");
      return false;
    }

    const found = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.role === normalizedRole
    );

    if (!found) {
      alert("Invalid email, password, or role.");
      return false;
    }

    const userObj = {
      id: found.id,
      fullName: found.fullName,
      email: found.email,
      role: found.role,
      clinicId: found.clinicId,
    };

    setUser(userObj);
    setAllUsers(users);

    localStorage.setItem("currentUser", JSON.stringify(userObj));
    return true;
  };

  // SIGNUP: Create user + clinic (if clinic)
  const signup = async (fullName, email, phoneNumber, password, role) => {
    const normalizedRole = role.toLowerCase();

    if (allUsers.some((u) => u.email === email)) {
      alert("Email already exists.");
      return false;
    }

    let clinicId = null;

    if (normalizedRole === "clinic") {
      const newClinic = {
        id: Date.now().toString(),
        name: fullName,
        location: "Nairobi",
        coordinates: [-1.2921, 36.8219],
        services: ["General Checkup"],
        rating: 0,
        reviews: 0,
        phone: phoneNumber,
        email: email,
        operatingHours: "Mon-Fri: 9AM-5PM",
        verified: false,
        status: "pending", // for admin approval
      };

      try {
        const clinicRes = await fetch(`${API_URL}/clinics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClinic),
        });
        if (!clinicRes.ok) throw new Error("Failed to create clinic");
        const savedClinic = await clinicRes.json();
        clinicId = savedClinic.id;
      } catch (err) {
        console.error("Clinic creation failed:", err);
        alert("Failed to create clinic account.");
        return false;
      }
    }

    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      phoneNumber,
      password,
      role: normalizedRole,
      clinicId,
      profile: {
        dob: "",
        gender: "",
        country: "",
        bloodType: "",
        allergies: "",
        emergencyContact: "",
      },
    };

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Signup failed");

      const savedUser = await res.json();
      const updatedUsers = [...allUsers, savedUser];
      setAllUsers(updatedUsers);

      const userObj = {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
        clinicId: savedUser.clinicId,
      };

      setUser(userObj);
      localStorage.setItem("currentUser", JSON.stringify(userObj));

      return true;
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    allUsers,
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
