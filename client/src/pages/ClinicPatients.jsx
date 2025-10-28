import React, { useState, useEffect } from "react";
import { Search, User, Phone, Calendar, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://localhost:4000";

const ClinicPatients = () => {
 const { user } = useAuth();
 const [patients, setPatients] = useState([]);
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchPatients = async () => {
 if (!user?.clinicId) {
 setLoading(false);
 return;
 }

 try {
 
 const apptRes = await fetch(
 `${API_URL}/appointments?clinicId=${user.clinicId}`
 );
 const appts = await apptRes.json();

 
 const patientIds = [...new Set(appts.map((a) => a.patientId))];

 if (patientIds.length === 0) {
 setPatients([]);
 setLoading(false);
 return;
 }

 
 const patientRes = await fetch(
 `${API_URL}/users?id=${patientIds.join("&id=")}`
 );
 const patientData = await patientRes.json();

 
 const patientMap = {};
 patientData.forEach((p) => {
 patientMap[p.id] = {
 ...p,
 lastVisit: null,
 };
 });

 
 appts.forEach((appt) => {
 const pid = appt.patientId;
 if (!patientMap[pid]) return;

 const apptDate = appt.date;
 const current = patientMap[pid].lastVisit;

 if (!current || apptDate > current) {
 patientMap[pid].lastVisit = apptDate;
 }
 });

 
 const enriched = Object.values(patientMap)
 .filter((p) => p.lastVisit !== null)
 .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));

 setPatients(enriched);
 } catch (err) {
 console.error("Failed to load patients:", err);
 alert("Failed to load patients");
 } finally {
 setLoading(false);
 }
 };

 fetchPatients();
 }, [user]);

 const filtered = patients.filter(
 (p) =>
 p.fullName.toLowerCase().includes(search.toLowerCase()) ||
 p.email.toLowerCase().includes(search.toLowerCase()) ||
 p.phoneNumber.includes(search)
 );

 const formatDate = (dateStr) => {
 const date = new Date(dateStr);
 return date.toLocaleDateString("en-GB", {
 day: "2-digit",
 month: "short",
 year: "numeric",
 }); 
 };

 if (loading) {
 return (
 <ClinicDashboardLayout>
 <div className="p-8 text-center">Loading patients...</div>
 </ClinicDashboardLayout>
 );
 }

 return (
 <ClinicDashboardLayout>
 <div className="max-w-5xl mx-auto">
 <div className="bg-white rounded-xl shadow-lg p-6">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">All Patients</h1>
 <p className="text-sm text-gray-500 mt-1">
 {patients.length} patient{patients.length !== 1 ? "s" : ""} seen
 </p>
 </div>
 <div className="relative">
 <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
 <input
 type="text"
 placeholder="Search by name, email, or phone..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 w-64 transition"
 />
 </div>
 </div>

 {filtered.length === 0 ? (
 <div className="text-center py-12 text-gray-500">
 {search ? "No patients match your search." : "No patients yet."}
 </div>
 ) : (
 <div className="space-y-4">
 {filtered.map((p) => (
 <div
 key={p.id}
 className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
 >
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
 {p.fullName
 .split(" ")
 .map((n) => n[0])
 .join("")
 .toUpperCase()}
 </div>
 <div>
 <h3 className="font-semibold text-gray-900">
 {p.fullName}
 </h3>
 <p className="text-sm text-gray-600 flex items-center">
 <Mail className="w-3.5 h-3.5 mr-1" /> {p.email}
 </p>
 </div>
 </div>
 <div className="text-right text-sm text-gray-600">
 <p className="flex items-center justify-end">
 <Phone className="w-3.5 h-3.5 mr-1" /> {p.phoneNumber}
 </p>
 <p className="flex items-center justify-end mt-1 font-medium text-gray-800">
 <Calendar className="w-3.5 h-3.5 mr-1" /> Last visit:{" "}
 {formatDate(p.lastVisit)}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </ClinicDashboardLayout>
 );
};

export default ClinicPatients;