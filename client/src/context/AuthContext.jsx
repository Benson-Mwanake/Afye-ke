 
import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "http://localhost:4000";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [allUsers, setAllUsers] = useState([]);

 
 useEffect(() => {
 const stored = localStorage.getItem("currentUser");
 if (stored) {
 try {
 const parsed = JSON.parse(stored);

 
 if (parsed.id && !parsed.phoneNumber) {
 fetch(`${API_URL}/users/${parsed.id}`)
 .then((res) => {
 if (res.ok) return res.json();
 throw new Error("User not found");
 })
 .then((fullUser) => {
 const enriched = {
 id: fullUser.id,
 fullName: fullUser.fullName,
 email: fullUser.email,
 phoneNumber: fullUser.phoneNumber,
 role: fullUser.role,
 clinicId: fullUser.clinicId,
 profile: fullUser.profile || {
 dob: "",
 gender: "",
 country: "",
 bloodType: "",
 allergies: "",
 emergencyContact: "",
 },
 savedClinics: fullUser.savedClinics || [],
 };
 setUser(enriched);
 localStorage.setItem("currentUser", JSON.stringify(enriched));
 })
 .catch(() => {
 setUser({
 id: parsed.id,
 fullName: parsed.fullName || "",
 email: parsed.email,
 role: parsed.role,
 clinicId: parsed.clinicId,
 savedClinics: parsed.savedClinics || [],
 });
 });
 } else {
 setUser({
 ...parsed,
 savedClinics: parsed.savedClinics || [],
 });
 }
 } catch (err) {
 console.error("Failed to parse stored user:", err);
 }
 }
 setLoading(false);
 }, []);

 
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

 
 const login = async (arg1, password, role) => {
 
 if (typeof arg1 === "object" && !password && !role) {
 const userObj = arg1;
 setUser(userObj);
 localStorage.setItem("currentUser", JSON.stringify(userObj));
 return true;
 }

 
 const email = arg1;
 const normalizedRole = (role || "").toLowerCase();

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
 (!normalizedRole || u.role === normalizedRole)
 );

 if (!found) {
 alert("Invalid email, password, or role.");
 return false;
 }

 let fullUser = found;
 try {
 const userRes = await fetch(`${API_URL}/users/${found.id}`);
 if (userRes.ok) {
 fullUser = await userRes.json();
 }
 } catch (err) {
 console.warn("Could not fetch full user, using minimal data", err);
 }

 const userObj = {
 id: fullUser.id,
 fullName: fullUser.fullName,
 email: fullUser.email,
 phoneNumber: fullUser.phoneNumber,
 role: fullUser.role,
 clinicId: fullUser.clinicId,
 profile: fullUser.profile || {
 dob: "",
 gender: "",
 country: "",
 bloodType: "",
 allergies: "",
 emergencyContact: "",
 },
 savedClinics: fullUser.savedClinics || [],
 };

 setUser(userObj);
 setAllUsers(users);
 localStorage.setItem("currentUser", JSON.stringify(userObj));
 return true;
 };

 
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
 status: "pending",
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
 savedClinics: [],
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
 phoneNumber: savedUser.phoneNumber,
 role: savedUser.role,
 clinicId: savedUser.clinicId,
 profile: savedUser.profile,
 savedClinics: savedUser.savedClinics || [],
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

 
 const toggleSavedClinic = async (clinicId) => {
 if (!user || user.role !== "patient") return false;

 const saved = user.savedClinics || [];
 const isSaved = saved.includes(clinicId);
 const updatedSaved = isSaved
 ? saved.filter((id) => id !== clinicId)
 : [...new Set([...saved, clinicId])];

 try {
 const res = await fetch(`${API_URL}/users/${user.id}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ savedClinics: updatedSaved }),
 });

 if (!res.ok) throw new Error("Failed to update");

 const updatedUser = await res.json();

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

 
 login(fullUser);
 return true;
 } catch (err) {
 console.error("toggleSavedClinic error:", err);
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