import React, { useState, useEffect, useRef } from "react";
import {
 Heart,
 LayoutDashboard,
 LogOut,
 Menu,
 X,
 UserCheck,
 MapPin,
 Upload,
 Mail,
 Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const API_URL = "http://localhost:4000";

const TextInput = ({ label, placeholder, value, onChange }) => (
 <div className="space-y-1">
 <label className="text-sm font-medium text-gray-600">{label}</label>
 <input
 type="text"
 className="w-full p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition"
 placeholder={placeholder}
 value={value}
 onChange={onChange}
 />
 </div>
);

const TextArea = ({ label, placeholder, value, onChange }) => (
 <div className="space-y-1">
 <label className="text-sm font-medium text-gray-600">{label}</label>
 <textarea
 rows={4}
 className="w-full p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition"
 placeholder={placeholder}
 value={value}
 onChange={onChange}
 />
 </div>
);

const CheckboxInput = ({ label, checked, onChange }) => (
 <div className="flex items-center">
 <input
 id={label.replace(/\s/g, "")}
 type="checkbox"
 checked={checked}
 onChange={onChange}
 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
 />
 <label
 htmlFor={label.replace(/\s/g, "")}
 className="ml-2 text-sm text-gray-700"
 >
 {label}
 </label>
 </div>
);

const OperatingHourRow = ({ label, hours, onToggle, onTimeChange }) => (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100">
 <div className="text-base font-medium text-gray-700 w-full sm:w-1/3 mb-2 sm:mb-0">
 {label}
 </div>
 {!hours.isClosed ? (
 <div className="flex space-x-3 w-full sm:w-2/3">
 <input
 type="time"
 value={hours.open}
 onChange={(e) => onTimeChange("open", e.target.value)}
 className="w-1/2 p-2 rounded-lg border border-gray-300"
 />
 <input
 type="time"
 value={hours.close}
 onChange={(e) => onTimeChange("close", e.target.value)}
 className="w-1/2 p-2 rounded-lg border border-gray-300"
 />
 <button
 onClick={onToggle}
 className="text-red-500 text-sm hover:text-red-700"
 >
 Close
 </button>
 </div>
 ) : (
 <div className="flex justify-between items-center w-full sm:w-2/3">
 <span className="text-red-500 font-semibold">Closed</span>
 <button
 onClick={onToggle}
 className="text-green-600 text-sm hover:text-green-700"
 >
 Open
 </button>
 </div>
 )}
 </div>
);

const ClinicProfile = () => {
 const { user } = useAuth();
 const navigate = useNavigate();
 const fileInputRef = useRef(null);

 const [clinic, setClinic] = useState(null);
 const [form, setForm] = useState({});
 const [images, setImages] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [uploading, setUploading] = useState(false);

 useEffect(() => {
 const load = async () => {
 if (!user?.clinicId) {
 setLoading(false);
 return;
 }
 try {
 const res = await fetch(`${API_URL}/clinics/${user.clinicId}`);
 if (!res.ok) throw new Error("Clinic not found");
 const data = await res.json();

 const normalized = {
 ...data,
 operatingHours: {
 mondayFriday: {
 open: data.operatingHours?.includes("Mon-Fri")
 ? "08:00"
 : "Closed",
 close: data.operatingHours?.includes("Mon-Fri")
 ? "20:00"
 : "Closed",
 isClosed: !data.operatingHours?.includes("Mon-Fri"),
 },
 saturday: {
 open: data.operatingHours?.includes("Sat") ? "09:00" : "Closed",
 close: data.operatingHours?.includes("Sat") ? "17:00" : "Closed",
 isClosed: !data.operatingHours?.includes("Sat"),
 },
 sunday: { open: "Closed", close: "Closed", isClosed: true },
 },
 services: {
 generalPractice:
 data.services?.includes("General Checkup") ?? false,
 laboratoryServices: data.services?.includes("Lab Tests") ?? false,
 dentalCare: data.services?.includes("Dental") ?? false,
 xRay: data.services?.includes("X-Ray") ?? false,
 surgery: data.services?.includes("Surgery") ?? false,
 physiotherapy: data.services?.includes("Physiotherapy") ?? false,
 pediatrics: data.services?.includes("Pediatrics") ?? false,
 pharmacy: data.services?.includes("Pharmacy") ?? false,
 maternity: data.services?.includes("Maternity") ?? false,
 immunization: data.services?.includes("Vaccinations") ?? false,
 emergencyServices: data.services?.includes("Emergency") ?? false,
 mentalHealth: false,
 },
 };

 setClinic(normalized);
 setForm(normalized);
 setImages(data.images || []);
 } catch (e) {
 console.error(e);
 alert("Failed to load clinic profile");
 } finally {
 setLoading(false);
 }
 };
 load();
 }, [user]);

 const handleBasic = (key, val) => setForm((p) => ({ ...p, [key]: val }));
 const handleService = (key) => {
 setForm((p) => ({
 ...p,
 services: { ...p.services, [key]: !p.services[key] },
 }));
 };
 const handleHoursToggle = (day) => {
 setForm((p) => ({
 ...p,
 operatingHours: {
 ...p.operatingHours,
 [day]: {
 ...p.operatingHours[day],
 isClosed: !p.operatingHours[day].isClosed,
 },
 },
 }));
 };
 const handleTime = (day, type, val) => {
 setForm((p) => ({
 ...p,
 operatingHours: {
 ...p.operatingHours,
 [day]: { ...p.operatingHours[day], [type]: val },
 },
 }));
 };

 
 const handleImageDrop = (e) => {
 e.preventDefault();
 const files = Array.from(e.dataTransfer.files);
 handleImageFiles(files);
 };

 const handleImageChange = (e) => {
 const files = Array.from(e.target.files);
 handleImageFiles(files);
 };

 const handleImageFiles = async (files) => {
 if (images.length + files.length > 5) {
 alert("Maximum 5 images allowed");
 return;
 }

 setUploading(true);
 const newImages = [];

 for (const file of files) {
 if (!file.type.startsWith("image/")) continue;

 const reader = new FileReader();
 reader.onload = async (e) => {
 const base64 = e.target.result;
 newImages.push(base64);

 if (newImages.length === files.length) {
 const updated = [...images, ...newImages];
 setImages(updated);

 
 try {
 await fetch(`${API_URL}/clinics/${user.clinicId}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ images: updated }),
 });
 } catch (err) {
 console.error("Image save failed:", err);
 } finally {
 setUploading(false);
 }
 }
 };
 reader.readAsDataURL(file);
 }
 };

 const removeImage = async (index) => {
 const updated = images.filter((_, i) => i !== index);
 setImages(updated);
 try {
 await fetch(`${API_URL}/clinics/${user.clinicId}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ images: updated }),
 });
 } catch (err) {
 console.error("Image remove failed:", err);
 }
 };

 const handleSave = async () => {
 setSaving(true);
 try {
 const payload = {
 name: form.name,
 location: form.location,
 phone: form.phone,
 email: form.email,
 operatingHours: [
 form.operatingHours.mondayFriday.isClosed ? "" : "Mon-Fri",
 form.operatingHours.saturday.isClosed ? "" : "Sat",
 ]
 .filter(Boolean)
 .join(", "),
 services: Object.entries(form.services)
 .filter(([, v]) => v)
 .map(([k]) => {
 const map = {
 generalPractice: "General Checkup",
 laboratoryServices: "Lab Tests",
 dentalCare: "Dental",
 xRay: "X-Ray",
 surgery: "Surgery",
 physiotherapy: "Physiotherapy",
 pediatrics: "Pediatrics",
 pharmacy: "Pharmacy",
 maternity: "Maternity",
 immunization: "Vaccinations",
 emergencyServices: "Emergency",
 };
 return map[k] || "";
 })
 .filter(Boolean),
 };

 const res = await fetch(`${API_URL}/clinics/${user.clinicId}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload),
 });

 if (!res.ok) throw new Error("Save failed");
 const saved = await res.json();
 setClinic({ ...clinic, ...saved });
 alert("Profile saved successfully!");
 } catch (e) {
 console.error(e);
 alert("Failed to save profile");
 } finally {
 setSaving(false);
 }
 };

 const profileCompletion = 85;

 const servicesList = [
 { key: "generalPractice", label: "General Practice" },
 { key: "laboratoryServices", label: "Laboratory Services" },
 { key: "dentalCare", label: "Dental Care" },
 { key: "xRay", label: "X‑Ray" },
 { key: "surgery", label: "Surgery" },
 { key: "physiotherapy", label: "Physiotherapy" },
 { key: "pediatrics", label: "Pediatrics" },
 { key: "pharmacy", label: "Pharmacy" },
 { key: "maternity", label: "Maternity" },
 { key: "immunization", label: "Immunization" },
 { key: "emergencyServices", label: "Emergency Services" },
 { key: "mentalHealth", label: "Mental Health" },
 ];

 if (loading) {
 return (
 <ClinicDashboardLayout>
 <div className="text-center py-12">Loading clinic profile…</div>
 </ClinicDashboardLayout>
 );
 }

 if (!clinic) {
 return (
 <ClinicDashboardLayout>
 <div className="text-center py-12 text-red-600">
 Clinic not found – please log in as a clinic.
 </div>
 </ClinicDashboardLayout>
 );
 }

 return (
 <ClinicDashboardLayout>
 {/* Header */}
 <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">
 Edit Clinic Profile
 </h1>
 <p className="text-gray-500">
 Update your clinic information and services
 </p>
 </div>
 <div className="flex space-x-3">
 <button
 onClick={() => navigate("/clinic-dashboard")}
 className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
 >
 Cancel
 </button>
 <button
 onClick={handleSave}
 disabled={saving}
 className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition disabled:opacity-70"
 >
 {saving ? "Saving…" : "Save Changes"}
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* LEFT – FORM */}
 <div className="lg:col-span-2 space-y-6">
 {/* Basic Info */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Basic Information
 </h2>
 <div className="space-y-4">
 <TextInput
 label="Clinic Name"
 placeholder="Enter clinic name"
 value={form.name || ""}
 onChange={(e) => handleBasic("name", e.target.value)}
 />
 <TextArea
 label="Description"
 placeholder="Briefly describe your clinic…"
 value={form.description || ""}
 onChange={(e) => handleBasic("description", e.target.value)}
 />
 </div>
 </div>

 {/* Contact */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Contact Information
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <TextInput
 label="Phone Number"
 placeholder="+254 700 111 111"
 value={form.phone || ""}
 onChange={(e) => handleBasic("phone", e.target.value)}
 />
 <TextInput
 label="Email Address"
 placeholder="info@clinic.com"
 value={form.email || ""}
 onChange={(e) => handleBasic("email", e.target.value)}
 />
 <div className="md:col-span-2">
 <TextInput
 label="Website (Optional)"
 placeholder="www.yourclinic.com"
 value={form.website || ""}
 onChange={(e) => handleBasic("website", e.target.value)}
 />
 </div>
 </div>
 </div>

 {/* Location */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <TextInput
 label="County"
 placeholder="Nairobi County"
 value={form.county || ""}
 onChange={(e) => handleBasic("county", e.target.value)}
 />
 <TextInput
 label="Area / Town"
 placeholder="Westlands, Nairobi"
 value={form.areaTown || ""}
 onChange={(e) => handleBasic("areaTown", e.target.value)}
 />
 <div className="md:col-span-2">
 <TextInput
 label="Full Address"
 placeholder="Parklands Road, Westlands"
 value={form.fullAddress || ""}
 onChange={(e) => handleBasic("fullAddress", e.target.value)}
 />
 </div>
 </div>
 </div>

 {/* Operating Hours */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Operating Hours
 </h2>
 <OperatingHourRow
 label="Monday – Friday"
 hours={form.operatingHours?.mondayFriday || {}}
 onToggle={() => handleHoursToggle("mondayFriday")}
 onTimeChange={(type, val) =>
 handleTime("mondayFriday", type, val)
 }
 />
 <OperatingHourRow
 label="Saturday"
 hours={form.operatingHours?.saturday || {}}
 onToggle={() => handleHoursToggle("saturday")}
 onTimeChange={(type, val) => handleTime("saturday", type, val)}
 />
 <OperatingHourRow
 label="Sunday"
 hours={form.operatingHours?.sunday || {}}
 onToggle={() => handleHoursToggle("sunday")}
 onTimeChange={(type, val) => handleTime("sunday", type, val)}
 />
 </div>

 {/* Services */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Services Offered
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {servicesList.map((s) => (
 <CheckboxInput
 key={s.key}
 label={s.label}
 checked={form.services?.[s.key] ?? false}
 onChange={() => handleService(s.key)}
 />
 ))}
 </div>
 </div>
 </div>

 {/* RIGHT – IMAGES & STATUS */}
 <div className="lg:col-span-1 space-y-6">
 {/* Images */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Clinic Images
 </h2>

 {/* Upload Area */}
 <div
 onDrop={handleImageDrop}
 onDragOver={(e) => e.preventDefault()}
 onClick={() => fileInputRef.current?.click()}
 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer"
 >
 <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
 <p className="text-sm font-medium text-gray-600">
 {uploading
 ? "Uploading..."
 : "Drop images here or click to upload"}
 </p>
 <p className="text-xs text-gray-500">
 JPG, PNG up to 5 MB • Max 5
 </p>
 <input
 ref={fileInputRef}
 type="file"
 multiple
 accept="image/*"
 onChange={handleImageChange}
 className="hidden"
 />
 </div>

 {/* Image Grid */}
 <div className="grid grid-cols-2 gap-3 mt-4">
 {images.map((src, i) => (
 <div key={i} className="relative group">
 <img
 src={src}
 alt={`Clinic ${i + 1}`}
 className="w-full h-24 object-cover rounded-lg shadow-sm"
 />
 <button
 onClick={() => removeImage(i)}
 className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
 >
 <Trash2 className="w-3 h-3" />
 </button>
 </div>
 ))}
 {images.length < 5 &&
 Array(5 - images.length)
 .fill()
 .map((_, i) => (
 <div
 key={`empty-${i}`}
 className="h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
 />
 ))}
 </div>
 </div>

 {/* Profile Status */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
 Profile Status
 </h2>
 <div className="mb-4">
 <p className="text-sm font-medium text-gray-700 mb-1">
 Profile Completion
 </p>
 <div className="w-full bg-gray-200 rounded-full h-2.5">
 <div
 className="bg-green-600 h-2.5 rounded-full transition-all"
 style={{ width: `${profileCompletion}%` }}
 />
 </div>
 <p className="text-right text-sm font-semibold text-gray-800 mt-1">
 {profileCompletion}%
 </p>
 </div>
 <div className="space-y-1 text-sm text-red-600">
 <p className="font-medium">Missing:</p>
 <ul className="list-disc ml-4 text-gray-600 space-y-0.5">
 <li>Clinic photos ({5 - images.length})</li>
 <li>Professional licenses</li>
 </ul>
 </div>
 </div>

 {/* Support */}
 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
 <h2 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h2>
 <p className="text-sm text-gray-600 mb-4">
 Contact our support team for assistance with your clinic profile.
 </p>
 <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition">
 <Mail className="w-4 h-4 mr-2" /> Contact Support
 </button>
 </div>
 </div>
 </div>
 </ClinicDashboardLayout>
 );
};

export default ClinicProfile;