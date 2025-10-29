// src/pages/ClinicDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Stethoscope,
  Heart,
  MessageCircle,
  Send,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "./BookingForm";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";

const API_URL = "http://localhost:4000";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------------------------------------------------
   1. LOAD CLINIC + REVIEWS
   --------------------------------------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/clinics/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Clinic not found");
        const c = await res.json();

        // ---- Enrich with safe hours display ----
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toLocaleString("en-US", { weekday: "long" });

        const is24h =
          Array.isArray(c.operatingHours) &&
          c.operatingHours.every(
            (h) => h.open === "00:00" && h.close === "23:59" && !h.closed
          );

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

        setClinic({ ...c, status, is24h });
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to load clinic.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id]);

  /* ---------------------------------------------------------
   2. HOURS DISPLAY – NEVER RENDER OBJECT
   --------------------------------------------------------- */
  const renderOperatingHours = () => {
    if (!clinic?.operatingHours || !Array.isArray(clinic.operatingHours))
      return "Hours not listed";

    if (clinic.is24h) return "Open 24/7";

    const grouped = {
      "Mon – Fri": null,
      Saturday: null,
      Sunday: null,
    };

    clinic.operatingHours.forEach((h) => {
      if (!h.closed) {
        if (
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
            h.day
          )
        ) {
          grouped["Mon – Fri"] = h;
        } else {
          grouped[h.day] = h;
        }
      }
    });

    const lines = [];
    if (grouped["Mon – Fri"]) {
      const h = grouped["Mon – Fri"];
      lines.push(`Mon – Fri: ${to12h(h.open)} – ${to12h(h.close)}`);
    }
    if (grouped.Saturday) {
      const h = grouped.Saturday;
      lines.push(`Sat: ${to12h(h.open)} – ${to12h(h.close)}`);
    }
    if (grouped.Sunday) {
      const h = grouped.Sunday;
      lines.push(`Sun: ${to12h(h.open)} – ${to12h(h.close)}`);
    }

    return lines.length ? lines.join(" • ") : "Closed";
  };

  const to12h = (t) => {
    if (!t) return "";
    const [h] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:00 ${period}`;
  };

  /* ---------------------------------------------------------
   3. SAVE / UNSAVE CLINIC
   --------------------------------------------------------- */
  const toggleSaveClinic = async () => {
    if (!user || user.role !== "patient") {
      alert("Please log in to save clinics.");
      return;
    }

    setIsSaving(true);
    try {
      const saved = user.savedClinics || [];
      const isSaved = saved.includes(id);
      const updatedSaved = isSaved
        ? saved.filter((cid) => cid !== id)
        : [...new Set([...saved, id])];

      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedClinics: updatedSaved }),
      });

      if (!res.ok) throw new Error("Failed to update saved clinics");

      const updatedUser = await res.json();
      login({
        ...user,
        savedClinics: updatedUser.savedClinics,
      });

      alert(isSaved ? "Clinic removed from saved." : "Clinic saved!");
    } catch (err) {
      alert("Failed to update. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------------------------------------------
   4. REVIEWS
   --------------------------------------------------------- */
  const handleReviewSubmit = () => {
    if (!newReview.comment.trim()) return;

    const review = {
      id: editingId || Date.now(),
      rating: newReview.rating,
      comment: newReview.comment,
      author: user?.fullName || "Anonymous",
      date: new Date().toISOString().split("T")[0],
    };

    const updated = editingId
      ? reviews.map((r) => (r.id === editingId ? review : r))
      : [...reviews, review];

    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setReviews(updated);
    setNewReview({ rating: 5, comment: "" });
    setEditingId(null);
  };

  const handleDelete = (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    const updated = reviews.filter((r) => r.id !== reviewId);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setReviews(updated);
  };

  const handleEdit = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment });
    setEditingId(review.id);
  };

  /* ---------------------------------------------------------
   5. RENDER
   --------------------------------------------------------- */
  if (loading) return <p className="text-center py-10">Loading clinic...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!clinic) return <p className="text-center py-10">Clinic not found.</p>;

  const isSaved = user?.savedClinics?.includes(id);
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : clinic.rating?.toFixed(1) || "0.0";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 h-64 md:h-full flex items-center justify-center text-white text-2xl font-bold p-4 text-center">
                {clinic.name}
              </div>
            </div>
            <div className="p-6 md:p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {clinic.name}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center mt-1">
                    <MapPin className="w-5 h-5 mr-1 text-gray-500" />
                    {clinic.location}
                  </p>
                </div>

                {/* Save/Unsave */}
                {user?.role === "patient" && (
                  <button
                    onClick={toggleSaveClinic}
                    disabled={isSaving}
                    className={`flex items-center font-medium transition ${
                      isSaved
                        ? "text-red-600 hover:text-red-700"
                        : "text-yellow-600 hover:text-yellow-700"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 mr-1 ${
                        isSaved ? "fill-current" : ""
                      }`}
                    />
                    {isSaving ? "..." : isSaved ? "Saved" : "Save"}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {clinic.phone || "Not listed"}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {renderOperatingHours()}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(avgRating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg text-gray-800">
                  {avgRating}/5.0
                </span>
                <span className="text-sm text-gray-500">
                  ({reviews.length} reviews)
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/booking/${clinic.id}`)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book Now</h2>
              <BookingForm clinicId={clinic.id} clinicName={clinic.name} />
            </div>
          </div>

          {/* Right: Services, Reviews, Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="w-6 h-6 mr-2 text-green-600" />
                Services Offered
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(clinic.services || []).map((s, i) => (
                  <div key={i} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
                Patient Reviews
              </h2>

              {/* Add/Edit Review */}
              {user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {editingId ? "Edit your review" : "Share your experience"}
                  </p>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? "text-amber-500"
                            : "text-gray-300"
                        }`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your review..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent mb-2"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={handleReviewSubmit}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {editingId ? "Update" : "Submit"}
                    </button>
                    {editingId && (
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewReview({ rating: 5, comment: "" });
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first!
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {r.author}
                          </p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < r.rating
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              {r.date}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">{r.comment}</p>
                        </div>
                        {user && r.author === user.fullName && (
                          <div className="flex gap-1 ml-4">
                            <button
                              onClick={() => handleEdit(r)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                <p className="text-gray-500">Map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClinicDetail;
