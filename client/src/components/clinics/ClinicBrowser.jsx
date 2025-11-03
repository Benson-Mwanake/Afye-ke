// src/components/clinics/ClinicBrowser.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";
import ClinicCard from "./ClinicCard";

const FILTERS = ["Nearest First", "Highest Rated", "Open Now", "24/7 Services"];

const ShowMoreClinics = ({ clinics }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? clinics : clinics.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((c) => (
          <ClinicCard key={c.id} clinic={c} />
        ))}
      </div>

      {clinics.length > 6 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition"
          >
            {showAll ? "Show Less" : `Show More (${clinics.length - 6} more)`}
          </button>
        </div>
      )}
    </>
  );
};

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
        const res = await fetch("https://gadgetreview-5c3b.onrender.com/clinics", {
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to load clinics – ${res.status}: ${txt}`);
        }

        const raw = await res.json();

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toLocaleString("en-US", { weekday: "long" });

        const enriched = raw.map((c) => {
          // 1. Distance
          const distance =
            c.distance ?? `${(Math.random() * 8 + 0.5).toFixed(1)} km`;

          // 2. 24/7 detection
          const is24h =
            Array.isArray(c.operatingHours) &&
            c.operatingHours.every(
              (h) => h.open === "00:00" && h.close === "23:59" && !h.closed
            );

          // 3. Status
          let status = "Closed";
          if (is24h) {
            status = "Open";
          } else if (Array.isArray(c.operatingHours)) {
            const today = c.operatingHours.find((h) => h.day === currentDay);
            if (today && !today.closed && today.open && today.close) {
              const [openH] = today.open.split(":").map(Number);
              const [closeH] = today.close.split(":").map(Number);
              if (currentHour >= openH && currentHour < closeH) {
                status = "Open";
              }
            }
          }

          // 4. Hours – first closing time in 12h format
          let hours = "N/A";
          if (Array.isArray(c.operatingHours)) {
            const firstOpen = c.operatingHours.find(
              (h) => !h.closed && h.close
            );
            if (firstOpen) {
              const [hour] = firstOpen.close.split(":").map(Number);
              const period = hour >= 12 ? "PM" : "AM";
              const h12 = hour % 12 || 12;
              hours = `${h12}:00 ${period}`;
            }
          }

          return { ...c, distance, status, hours, is24h };
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
        list.sort((a, b) => (b.is24h ? 1 : -1));
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

      {/* Search */}
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

      {/* Count */}
      <p className="text-md font-medium text-gray-700 mb-4 max-w-3xl mx-auto">
        {filteredClinics.length} provider
        {filteredClinics.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="max-w-3xl mx-auto">
        {filteredClinics.length > 0 ? (
          <ShowMoreClinics clinics={filteredClinics} />
        ) : (
          <div className="text-center py-8 bg-white rounded-2xl shadow-md border border-gray-100">
            <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-lg text-gray-600">
              No clinics match your search.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try different keywords or filters.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
