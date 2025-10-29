import React, { useState, useEffect } from "react";
import {
 Calendar,
 MapPin,
 BookOpen,
 Heart,
 BriefcaseMedical,
 Clock,
 Phone,
 Mail,
 CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000";

const PatientStatCard = ({
 title,
 value,
 icon: Icon,
 color,
 trendValue,
 navigateTo,
}) => {
 const colors = {
 green: { bg: "bg-green-600", text: "text-white", trend: "text-green-200" },
 blue: { bg: "bg-indigo-600", text: "text-white", trend: "text-indigo-200" },
 "dark-green": {
 bg: "bg-teal-600",
 text: "text-white",
 trend: "text-teal-200",
 },
 "light-blue": {
 bg: "bg-blue-600",
 text: "text-white",
 trend: "text-blue-200",
 },
 };
 const { bg, text, trend } = colors[color] || colors.green;

 return (
 <a
 href={navigateTo || "#"}
 className={`${bg} p-6 sm:p-7 md:p-8 rounded-xl shadow-lg transition-shadow hover:shadow-2xl flex flex-col justify-between h-full`}
 >
 <div className="flex items-center justify-between mb-2">
 <h3 className={`text-base sm:text-lg font-medium ${text} opacity-80`}>
 {title}
 </h3>
 <div className={`p-2 sm:p-3 rounded-full bg-white bg-opacity-20`}>
 <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${text}`} />
 </div>
 </div>
 <p className={`mt-1 text-3xl sm:text-4xl font-extrabold ${text}`}>
 {value}
 </p>
 <p className={`mt-2 text-sm ${trend} font-medium`}>{trendValue}</p>
 </a>
 );
};

const QuickActionCard = ({
 title,
 description,
 icon: Icon,
 onClick,
 iconColor,
 iconBg,
}) => (
 <button
 onClick={onClick}
 className="bg-white p-5 rounded-xl shadow-md border border-gray-100 text-left transition-all hover:shadow-lg hover:border-green-300 flex items-center space-x-4 w-full h-full"
 >
 <div className={`p-3 rounded-full ${iconBg} flex-shrink-0`}>
 <Icon className={`w-6 h-6 ${iconColor}`} />
 </div>
 <div>
 <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
 <p className="text-sm text-gray-500 mt-1">{description}</p>
 </div>
 </button>
);

const AppointmentRow = ({
 clinic,
 doctor,
 service,
 date,
 time,
 id,
 navigate,
 onCancel,
}) => (
 <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
 <div className="flex items-start space-x-4">
 <BriefcaseMedical className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
 <div>
 <h4 className="font-semibold text-gray-800">{clinic}</h4>
 <p className="text-sm text-gray-600">
 {doctor} • {service}
 </p>
 <div className="flex items-center text-sm text-gray-500 mt-1">
 <Clock className="w-3 h-3 mr-1" />
 {date} @ {time}
 </div>
 </div>
 </div>
 <div className="flex gap-2 mt-3 sm:mt-0">
 <button
 onClick={() => navigate(`/appointment/${id}`)}
 className="text-sm font-medium text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
 >
 Details
 </button>
 <button
 onClick={() => onCancel(id)}
 className="text-sm font-medium text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
 >
 Cancel
 </button>
 </div>
 </div>
);

const PatientDashboard = () => {
 const navigate = useNavigate();
 const { user: authUser } = useAuth(); 
 const [user, setUser] = useState(null); 
 const [stats, setStats] = useState([
 {
 title: "Upcoming Appointments",
 value: 0,
 icon: Calendar,
 color: "green",
 trend: "Loading…",
 },
 {
 title: "Saved Clinics",
 value: 0,
 icon: MapPin,
 color: "blue",
 trend: "Loading…",
 },
 {
 title: "Articles Read",
 value: 0,
 icon: BookOpen,
 color: "dark-green",
 trend: "Loading…",
 },
 {
 title: "Health Checkups",
 value: 0,
 icon: Heart,
 color: "light-blue",
 trend: "Loading…",
 },
 ]);

 const [upcomingAppointments, setUpcomingAppointments] = useState([]);
 const [clinicsMap, setClinicsMap] = useState({});

 
 useEffect(() => {
 if (!authUser?.id) return;

 const ctrl = new AbortController();

 const loadFullUser = async () => {
 try {
 const res = await fetch(`${API_URL}/users/${authUser.id}`, {
 signal: ctrl.signal,
 });
 if (res.ok) {
 const fullUser = await res.json();
 setUser(fullUser);
 } else {
 setUser(authUser); 
 }
 } catch (e) {
 if (e.name !== "AbortError") console.error(e);
 setUser(authUser);
 }
 };

 loadFullUser();
 return () => ctrl.abort();
 }, [authUser]);

 
 useEffect(() => {
 if (!user?.id) return;

 const ctrl = new AbortController();

 const refresh = async () => {
 try {
 
 const apptRes = await fetch(
 `${API_URL}/appointments?patientId=${user.id}`,
 { signal: ctrl.signal }
 );
 const allAppts = apptRes.ok ? await apptRes.json() : [];

 const upcoming = allAppts.filter((a) =>
 ["Confirmed", "Pending", "Scheduled"].includes(a.status)
 );
 const checkups = allAppts.filter(
 (a) =>
 a.status === "Completed" &&
 (a.service?.toLowerCase().includes("checkup") ||
 a.notes?.toLowerCase().includes("checkup"))
 );

 
 const savedCount = Array.isArray(user.savedClinics)
 ? user.savedClinics.length
 : 0;

 
 const artRes = await fetch(`${API_URL}/articles`, {
 signal: ctrl.signal,
 });
 const articles = artRes.ok ? await artRes.json() : [];
 const published = articles.filter((a) => a.published).length;


 const clinRes = await fetch(`${API_URL}/clinics`, {
 signal: ctrl.signal,
 });
 const clinics = clinRes.ok ? await clinRes.json() : [];
 const map = {};
 clinics.forEach((c) => (map[c.id] = c.name));
 setClinicsMap(map);


 setStats([
 {
 title: "Upcoming Appointments",
 value: upcoming.length,
 icon: Calendar,
 color: "green",
 trend: upcoming.length
 ? `${upcoming.length} upcoming`
 : "No upcoming",
 },
 {
 title: "Saved Clinics",
 value: savedCount,
 icon: MapPin,
 color: "blue",
 trend: savedCount ? `${savedCount} saved` : "None saved",
 },
 {
 title: "Articles Read",
 value: published,
 icon: BookOpen,
 color: "dark-green",
 trend: "Stay informed!",
 },
 {
 title: "Health Checkups",
 value: checkups.length,
 icon: Heart,
 color: "light-blue",
 trend: checkups.length
 ? `${checkups.length} this year`
 : "Due soon",
 },
 ]);

 setUpcomingAppointments(upcoming.slice(0, 3));
 } catch (e) {
 if (e.name !== "AbortError") console.error(e);
 }
 };

 refresh();
 const int = setInterval(refresh, 30_000);
 return () => {
 ctrl.abort();
 clearInterval(int);
 };
 }, [user]);

 
 const handleCancelAppointment = async (id) => {
 if (!window.confirm("Cancel this appointment?")) return;

 try {
 await fetch(`${API_URL}/appointments/${id}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: "Cancelled" }),
 });

 const res = await fetch(`${API_URL}/appointments?patientId=${user.id}`);
 const all = res.ok ? await res.json() : [];
 const upcoming = all.filter((a) =>
 ["Confirmed", "Pending", "Scheduled"].includes(a.status)
 );
 setUpcomingAppointments(upcoming.slice(0, 3));

 setStats((prev) =>
 prev.map((s) =>
 s.title === "Upcoming Appointments"
 ? {
 ...s,
 value: upcoming.length,
 trend: upcoming.length
 ? `${upcoming.length} upcoming`
 : "No upcoming",
 }
 : s
 )
 );
 alert("Cancelled");
 } catch {
 alert("Failed");
 }
 };

 
 if (!user) {
 return (
 <DashboardLayout>
 <div className="text-center py-10 text-gray-600">
 Loading profile...
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout>
 <div className="mb-8">
 <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
 Welcome back, {user.fullName.split(" ")[0]}!
 </h1>
 <p className="text-lg text-gray-600">Your health overview</p>
 </div>

 {/* STAT CARDS */}
 <section className="mb-10">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
 {stats.map((s) => (
 <PatientStatCard
 key={s.title}
 {...s}
 navigateTo={
 s.title === "Upcoming Appointments"
 ? "/appointments"
 : s.title === "Saved Clinics"
 ? "/saved-clinics"
 : s.title === "Articles Read"
 ? "/articles"
 : s.title === "Health Checkups"
 ? "/checkups"
 : "#"
 }
 />
 ))}
 </div>
 </section>

 {/* MAIN GRID */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* LEFT */}
 <div className="lg:col-span-2 space-y-8">
 {/* Quick actions */}
 <div>
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Quick Actions
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <QuickActionCard
 title="Find Clinics"
 description="Search for healthcare providers near you"
 icon={MapPin}
 onClick={() => navigate("/find-clinics")}
 iconColor="text-blue-600"
 iconBg="bg-blue-100"
 />
 <QuickActionCard
 title="Symptom Checker"
 description="Check your symptoms with AI assistance"
 icon={Heart}
 onClick={() => navigate("/symptom-checker")}
 iconColor="text-red-600"
 iconBg="bg-red-100"
 />
 <QuickActionCard
 title="Health Tips"
 description="Read articles and health education"
 icon={BookOpen}
 onClick={() => navigate("/health-tips")}
 iconColor="text-green-600"
 iconBg="bg-green-100"
 />
 </div>
 </div>

 {/* Upcoming appointments */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-xl font-bold text-gray-800">
 Upcoming Appointments
 </h2>
 <button
 onClick={() => navigate("/appointments")}
 className="text-sm font-medium text-green-600 hover:text-green-700"
 >
 View All
 </button>
 </div>
 <div className="divide-y divide-gray-100">
 {upcomingAppointments.length ? (
 upcomingAppointments.map((a) => (
 <AppointmentRow
 key={a.id}
 clinic={clinicsMap[a.clinicId] || a.clinicName || "Unknown"}
 doctor={a.doctor || "Dr. Not Assigned"}
 service={a.service || "General"}
 date={a.date}
 time={a.time}
 id={a.id}
 navigate={navigate}
 onCancel={handleCancelAppointment}
 />
 ))
 ) : (
 <p className="text-gray-500 pt-4">
 No upcoming appointments scheduled.
 </p>
 )}
 </div>
 </div>
 </div>

 {/* RIGHT SIDEBAR */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
 <div className="w-16 h-16 bg-blue-500 text-white font-bold text-2xl rounded-full flex items-center justify-center mb-4">
 {(
 user.fullName
 .split(" ")
 .map((n) => n[0])
 .join("") || "P"
 ).toUpperCase()}
 </div>
 <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
 <p className="text-sm text-gray-500 mb-4">{user.email}</p>
 <button
 onClick={() => navigate("/profile")}
 className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg"
 >
 View Profile
 </button>
 </div>

 <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 shadow-md">
 <div className="flex items-center mb-3">
 <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
 <h4 className="font-semibold text-green-800">Health Reminder</h4>
 </div>
 <p className="text-sm text-green-700 mb-4">
 Don't forget your <strong>annual checkup</strong> is coming up
 soon!
 </p>
 <button
 onClick={() => navigate("/find-clinics")}
 className="w-full text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 shadow-md font-medium"
 >
 Book Now
 </button>
 </div>

 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h4 className="text-lg font-bold text-gray-800 mb-3">
 Emergency Contacts
 </h4>
 <div className="space-y-3">
 <div className="p-3 bg-red-50 rounded-lg flex items-center justify-between border-l-4 border-red-400">
 <div className="flex items-center space-x-3">
 <Phone className="w-5 h-5 text-red-600" />
 <div>
 <p className="font-semibold text-red-800">
 Emergency Hotline
 </p>
 <p className="text-sm text-red-600">999</p>
 </div>
 </div>
 </div>
 <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border-l-4 border-gray-300">
 <div className="flex items-center space-x-3">
 <Mail className="w-5 h-5 text-gray-600" />
 <div>
 <p className="font-semibold text-gray-800">
 AfyaLink Support
 </p>
 <p className="text-sm text-gray-600">+254 700 000 000</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
};

export default PatientDashboard;