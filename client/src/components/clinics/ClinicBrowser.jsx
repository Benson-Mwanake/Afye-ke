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
       const res = await fetch("http://localhost:4000/clinics", { signal: controller.signal });
       if (!res.ok) {
         const txt = await res.text();
         throw new Error(`Failed to load clinics – ${res.status}: ${txt}`);
       }
       const raw = await res.json();

       const now = new Date();
       const currentHour = now.getHours();

       const enriched = raw.map((c) => {
         const distance = c.distance ?? `${(Math.random() * 8 + 0.5).toFixed(1)} km`;
         const is24h = /24[/]?7/i.test(c.operatingHours);
         const status = is24h ? "Open" : currentHour >= 8 && currentHour < 20 ? "Open" : "Closed";
         const hoursMatch = c.operatingHours.match(/(\d{1,2}(:\d{2})?\s*[AP]M)/i);
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
