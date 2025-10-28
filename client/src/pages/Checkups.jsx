import React, { useEffect, useState } from "react";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { Calendar, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:4000";

const CheckupItem = ({ title, date, status, clinic, onBook }) => {
 const isDone = status === "Completed";
 const isDue = new Date(date) < new Date() && !isDone;
 const isUpcoming =
 new Date(date) >= new Date() &&
 ["Scheduled", "Pending", "Confirmed"].includes(status);

 return (
 <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
 <div className="flex items-center space-x-4">
 {isDone ? (
 <CheckCircle className="w-6 h-6 text-green-600" />
 ) : isDue ? (
 <AlertCircle className="w-6 h-6 text-orange-600" />
 ) : isUpcoming ? (
 <Calendar className="w-6 h-6 text-blue-600" />
 ) : (
 <Calendar className="w-6 h-6 text-gray-500" />
 )}
 <div>
 <h4 className="font-medium text-gray-900">{title}</h4>
 <p className="text-sm text-gray-500">
 {clinic} •{" "}
 {new Date(date).toLocaleDateString("en-US", {
 month: "short",
 day: "numeric",
 year: "numeric",
 })}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span
 className={`text-xs font-medium px-2 py-1 rounded-full ${
 isDone
 ? "bg-green-100 text-green-700"
 : isDue
 ? "bg-orange-100 text-orange-700"
 : isUpcoming
 ? "bg-blue-100 text-blue-700"
 : "bg-gray-100 text-gray-600"
 }`}
 >
 {isDone
 ? "Done"
 : isDue
 ? "Overdue"
 : isUpcoming
 ? "Upcoming"
 : "Scheduled"}
 </span>
 {isDue && (
 <button
 onClick={onBook}
 className="text-xs font-medium text-orange-600 hover:underline"
 >
 Rebook
 </button>
 )}
 </div>
 </div>
 );
};

export default function Checkups() {
 const { user } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const [checkups, setCheckups] = useState([]);
 const [loading, setLoading] = useState(true);
 const [clinicMap, setClinicMap] = useState({});
 const [refreshTrigger, setRefreshTrigger] = useState(0);

 useEffect(() => {
 if (location.state?.fromBooking) {
 setRefreshTrigger((prev) => prev + 1);
 window.history.replaceState({}, document.title);
 }
 }, [location]);

 useEffect(() => {
 const controller = new AbortController();
 const loadClinics = async () => {
 try {
 const res = await fetch(`${API_URL}/clinics`, {
 signal: controller.signal,
 });
 if (res.ok) {
 const data = await res.json();
 const map = {};
 data.forEach((c) => (map[c.id] = c.name));
 setClinicMap(map);
 }
 } catch (_) {}
 };
 loadClinics();
 return () => controller.abort();
 }, []);

 useEffect(() => {
 if (!user?.id) {
 setLoading(false);
 return;
 }
 const controller = new AbortController();

 const loadCheckups = async () => {
 try {
 const res = await fetch(
 `${API_URL}/appointments?patientId=${user.id}`,
 { signal: controller.signal }
 );
 if (!res.ok) throw new Error("Failed");
 const appts = await res.json();

 const checkupAppts = appts
 .filter((a) => {
 const s = (a.service || "").toLowerCase();
 const n = (a.notes || "").toLowerCase();
 return (
 s.includes("checkup") ||
 s.includes("screening") ||
 n.includes("checkup") ||
 n.includes("screening")
 );
 })
 .map((a) => ({
 id: a.id,
 title: a.service || "Health Check-up",
 date: a.date,
 status: a.status,
 clinic: clinicMap[a.clinicId] || a.clinicName || "Unknown Clinic",
 clinicId: a.clinicId,
 }))
 .sort((a, b) => new Date(b.date) - new Date(a.date));

 setCheckups(checkupAppts);
 } catch (err) {
 if (err.name !== "AbortError") console.error(err);
 } finally {
 setLoading(false);
 }
 };

 loadCheckups();
 return () => controller.abort();
 }, [user, clinicMap, refreshTrigger]);

 const handleBookCheckup = (clinicId) => navigate(`/booking/${clinicId}`);
 const handleNewCheckup = () => navigate("/find-clinics");

 return (
 <DashboardLayout>
 <div className="max-w-4xl mx-auto py-8">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">
 Health Check-ups
 </h1>
 <p className="text-gray-600">Stay on top of your preventive care</p>
 </div>
 <button
 onClick={handleNewCheckup}
 className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
 >
 <Plus className="w-5 h-5" /> Book Check-up
 </button>
 </div>

 {loading ? (
 <p className="text-center text-gray-500">Loading check-ups...</p>
 ) : checkups.length > 0 ? (
 <div className="space-y-4">
 {checkups.map((c) => (
 <CheckupItem
 key={c.id}
 {...c}
 onBook={() => handleBookCheckup(c.clinicId)}
 />
 ))}
 </div>
 ) : (
 <div className="text-center py-12">
 <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
 <p className="text-gray-500 text-lg">No check-ups scheduled yet.</p>
 <button
 onClick={handleNewCheckup}
 className="mt-4 text-green-600 font-medium hover:underline"
 >
 Schedule your first check-up
 </button>
 </div>
 )}

 <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
 <h3 className="font-bold text-blue-900 mb-3">Recommended for You</h3>
 <div className="space-y-3 text-sm">
 <div className="flex justify-between">
 <span>Annual Physical Exam</span>
 <span className="text-blue-600 font-medium">Every 12 months</span>
 </div>
 <div className="flex justify-between">
 <span>Dental Cleaning</span>
 <span className="text-blue-600 font-medium">Every 6 months</span>
 </div>
 <div className="flex justify-between">
 <span>Eye Exam</span>
 <span className="text-blue-600 font-medium">Every 2 years</span>
 </div>
 <div className="flex justify-between">
 <span>Blood Pressure Check</span>
 <span className="text-blue-600 font-medium">Every visit</span>
 </div>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}