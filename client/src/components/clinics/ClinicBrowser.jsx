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
