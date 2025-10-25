import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { User } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation Schema
const ProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\+2547\d{8}$/, "Phone number must be in format +2547XXXXXXXX")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const updateData = { ...values };
      if (!values.password) delete updateData.password; // Don't update password if empty
      const res = await fetch(`http://localhost:4000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      const userObj = {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        clinicId: updatedUser.clinicId,
        profile: updatedUser.profile,
      };
      localStorage.setItem("currentUser", JSON.stringify(userObj));
      alert("Profile updated successfully");
    } catch (err) {
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          Admin Profile
        </h1>
        <p className="text-lg text-gray-600">Manage your profile details</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold bg-green-500">
            {user?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "A"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {user?.fullName || "Admin"}
            </h2>
            <p className="text-sm text-gray-500">County Health Officer</p>
          </div>
        </div>
        <Formik
          initialValues={{
            fullName: user?.fullName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            password: "",
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="fullName"
                  className="border p-2 w-full rounded"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="border p-2 w-full rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Field
                  type="text"
                  name="phoneNumber"
                  className="border p-2 w-full rounded"
                  placeholder="+2547XXXXXXXX"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Password (optional)
                </label>
                <Field
                  type="password"
                  name="password"
                  className="border p-2 w-full rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ${
                  isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Save Changes
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
