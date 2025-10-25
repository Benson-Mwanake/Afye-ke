import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Phone, Clock, Stethoscope, Heart, MessageCircle, Send, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "./BookingForm";
import { getClinicById } from "../../services/clinicService";
import DashboardLayout from "../../hooks/layouts/DashboardLayout";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Load clinic + reviews
  useEffect(() => {
    const loadData = async () => {
      try {
        const c = await getClinicById(parseInt(id, 10));
        setClinic(c);

        const savedReviews = JSON.parse(
          localStorage.getItem(`reviews_${id}`) || "[]"
        );
        setReviews(savedReviews);
      } catch (err) {
        setError("Failed to load clinic.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Save clinic to saved list
  const handleSaveClinic = () => {
    const saved = JSON.parse(localStorage.getItem("savedClinics") || "[]");
    if (!saved.some((c) => c.id === clinic.id)) {
      saved.push({
        id: clinic.id,
        name: clinic.name,
        location: clinic.location,
        contact: clinic.contact || "N/A",
        hours: clinic.hours?.weekdays || "N/A",
      });
      localStorage.setItem("savedClinics", JSON.stringify(saved));
      alert("Clinic saved!");
    } else {
      alert("Already saved.");
    }
  };

  // Submit review
  const handleReviewSubmit = () => {
    if (!newReview.comment.trim()) return;

    const review = {
      id: Date.now(),
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

  // Delete review
  const handleDelete = (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    const updated = reviews.filter((r) => r.id !== reviewId);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
    setReviews(updated);
  };

  // Edit review
  const handleEdit = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment });
    setEditingId(review.id);
  };

  if (loading) return <p className="text-center py-10">Loading clinic...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!clinic) return <p className="text-center py-10">Clinic not found.</p>;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={
                  clinic.imageUrl ||
                  `https://placehold.co/600x400/10B981/white?text=${encodeURIComponent(
                    clinic.name
                  )}`
                }
                alt={clinic.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {clinic.name}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center mt-1">
                    <MapPin className="w-5 h-5 mr-1 text-gray-500" />
                    {clinic.location}, {clinic.county}
                  </p>
                </div>
                <button
                  onClick={handleSaveClinic}
                  className="flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  Save
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {clinic.contact || "Not listed"}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {clinic.hours?.weekdays || "Hours not listed"}
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

              <p className="text-gray-700 mb-6">
                {clinic.description ||
                  "Quality healthcare services in your community."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/booking/${clinic.id}`)}
                  className="bg-afyaBlue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns: Booking + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book Now</h2>
              <BookingForm clinicId={clinic.id} clinicName={clinic.name} />
            </div>
          </div>

          {/* Right: Services, Doctors, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="w-6 h-6 mr-2 text-afyaBlue" />
                Services Offered
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(
                  clinic.services || [
                    "General Checkup",
                    "Vaccinations",
                    "Maternity",
                  ]
                ).map((s, i) => (
                  <div key={i} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-afyaBlue rounded-full mr-2"></div>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctors */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Our Doctors
              </h2>
              <div className="space-y-4">
                {(
                  clinic.doctors || [
                    { name: "Dr. Aisha Mwangi", specialty: "Pediatrician" },
                    {
                      name: "Dr. John Omondi",
                      specialty: "General Practitioner",
                    },
                  ]
                ).map((d, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{d.name}</p>
                      <p className="text-sm text-gray-600">{d.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-afyaBlue" />
                Patient Reviews
              </h2>

              {/* Add Review */}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afyaBlue focus:border-transparent mb-2"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={handleReviewSubmit}
                      className="bg-afyaBlue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center"
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