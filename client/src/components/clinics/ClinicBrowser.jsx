 
import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";
import ClinicCard from "./ClinicCard";


const FILTERS = ["Nearest First", "Highest Rated", "Open Now", "24/7 Services"];


export default function ClinicBrowser() {
 const [searchTerm, setSearchTerm] = useState("");
 const [activeFilter, setActiveFilter] = useState(FILTERS[0]); 
 const [clinics, setClinics] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 
 useEffect(() => {
 const controller = new AbortController();

 const fetchClinics = async () => {
 try {
 const res = await fetch("http://localhost:4000/clinics", {
 signal: controller.signal,
 });

 if (!res.ok) {
 const txt = await res.text();
 throw new Error(`Failed to load clinics – ${res.status}: ${txt}`);
 }

 const raw = await res.json();

 
 const now = new Date();
 const currentHour = now.getHours();

 const enriched = raw.map((c) => {
 
 const distance =
 c.distance ?? `${(Math.random() * 8 + 0.5).toFixed(1)} km`;

 
 const is24h = /24[/]?7/i.test(c.operatingHours);
 const status = is24h
 ? "Open"
 : currentHour >= 8 && currentHour < 20
 ? "Open"
 : "Closed";

 
 const hoursMatch = c.operatingHours.match(
 /(\d{1,2}(:\d{2})?\s*[AP]M)/i
 );
 const hours = hoursMatch ? hoursMatch[0] : "N/A";

 return { ...c, distance, status, hours };
 });

 setClinics(enriched);
 setError(null);
 } catch (err) {
 if (err.name !== "AbortError") {
 console.error("ClinicBrowser fetch error:", err);
 setError(err.message);
 }
 } finally {
 setLoading(false);
 }
 };

 fetchClinics();

 
 const interval = setInterval(fetchClinics, 30_000);
 return () => {
 controller.abort();
 clearInterval(interval);
 };
 }, []);

 
 const filteredClinics = useMemo(() => {
 let list = clinics.filter(
 (c) =>
 c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 c.location.toLowerCase().includes(searchTerm.toLowerCase())
 );

 switch (activeFilter) {
 case "Highest Rated":
 list.sort((a, b) => b.rating - a.rating);
 break;
 case "Nearest First":
 list.sort((a, b) => {
 const da = a.distance === "N/A" ? Infinity : parseFloat(a.distance);
 const db = b.distance === "N/A" ? Infinity : parseFloat(b.distance);
 return da - db;
 });
 break;
 case "Open Now":
 list.sort((a, b) => (b.status === "Open" ? 1 : -1));
 break;
 case "24/7 Services":
 list.sort((a, b) => (/24[/]?7/i.test(b.operatingHours) ? 1 : -1));
 break;
 default:
 break;
 }

 return list;
 }, [clinics, searchTerm, activeFilter]);

 
 if (loading) {
 return (
 <DashboardLayout>
 <div className="flex items-center justify-center min-h-[60vh]">
 <p className="text-lg text-gray-600">Loading clinics…</p>
 </div>
 </DashboardLayout>
 );
 }

 if (error) {
 return (
 <DashboardLayout>
 <div className="flex items-center justify-center min-h-[60vh] text-red-600">
 <p>{error}</p>
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout>
 {/* Header */}
 <header className="mb-6">
 <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
 Explore Healthcare Providers
 </h1>
 <p className="text-md md:text-lg text-gray-500 mt-1">
 Find clinics and medical centers near you
 </p>
 </header>

 {/* Search Bar */}
 <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 flex items-center max-w-3xl mx-auto mb-6">
 <Search className="w-5 h-5 ml-3 text-gray-400" />
 <input
 type="text"
 placeholder="Search by name or location..."
 className="w-full px-4 py-2 text-gray-700 focus:outline-none rounded-r-2xl"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>

 {/* Filters */}
 <div className="flex flex-wrap gap-2 mb-6 max-w-3xl mx-auto">
 {FILTERS.map((f) => (
 <button
 key={f}
 onClick={() => setActiveFilter(f)}
 className={`px-3 py-1 text-sm font-medium rounded-lg transition duration-200 ${
 activeFilter === f
 ? "bg-teal-600 text-white"
 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
 }`}
 >
 {f}
 </button>
 ))}
 </div>

 {/* Results count */}
 <p className="text-md font-medium text-gray-700 mb-4 max-w-3xl mx-auto">
 {filteredClinics.length} provider
 {filteredClinics.length !== 1 ? "s" : ""} found
 </p>

 {/* Clinic Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
 {filteredClinics.length > 0 ? (
 filteredClinics.map((clinic) => (
 <ClinicCard key={clinic.id} clinic={clinic} />
 ))
 ) : (
 <div className="col-span-full text-center py-8 bg-white rounded-2xl shadow-md border border-gray-100">
 <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
 <p className="text-lg text-gray-600">
 No clinics match your search.
 </p>
 <p className="text-sm text-gray-400 mt-1">
 Please try different keywords or filters.
 </p>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}