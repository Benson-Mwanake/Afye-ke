// src/components/clinic/EditPatientModal.jsx
import React from "react";
import { XCircle, Save } from "lucide-react";

const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const [form, setForm] = React.useState({
    fullName: patient.fullName || "",
    email: patient.email || "",
    phoneNumber: patient.phoneNumber || "",
    profile: {
      dob: patient.profile?.dob || "",
      gender: patient.profile?.gender || "",
      country: patient.profile?.country || "",
      bloodType: patient.profile?.bloodType || "Unknown",
      allergies: patient.profile?.allergies || "",
      emergencyContact: patient.profile?.emergencyContact || "",
    },
  });

  const handleChange = (field, value) => {
    if (field.startsWith("profile.")) {
      const key = field.split(".")[1];
      setForm((prev) => ({
        ...prev,
        profile: { ...prev.profile, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Not authenticated. Please log in.");
      return;
    }

    // Validate form
    if (!form.fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber ? form.phoneNumber.trim() : undefined,
      profile: {
        dob: form.profile.dob || undefined,
        gender: form.profile.gender || undefined,
        country: form.profile.country || undefined,
        bloodType: form.profile.bloodType || undefined,
        allergies: form.profile.allergies || undefined,
        emergencyContact: form.profile.emergencyContact || undefined,
      },
    };

    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${patient.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Backend Error:", err);
        throw new Error(err.msg || "Failed to save patient information.");
      }

      const updatedPatient = await res.json();
      onSave(updatedPatient);
      onClose();
      alert("Patient updated successfully!");
    } catch (err) {
      console.error("Fetch Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Patient: {patient.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.profile.dob}
                onChange={(e) => handleChange("profile.dob", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={form.profile.gender}
                onChange={(e) => handleChange("profile.gender", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.profile.country}
                onChange={(e) =>
                  handleChange("profile.country", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select
                value={form.profile.bloodType}
                onChange={(e) =>
                  handleChange("profile.bloodType", e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <input
                type="text"
                value={form.profile.allergies}
                onChange={(e) =>
                  handleChange("profile.allergies", e.target.value)
                }
                placeholder="e.g. Penicillin, Nuts"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={form.profile.emergencyContact}
                onChange={(e) =>
                  handleChange("profile.emergencyContact", e.target.value)
                }
                placeholder="Name • Phone"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
