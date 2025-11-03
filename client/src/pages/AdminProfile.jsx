import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../hooks/layouts/AdminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().min(3).required("Full name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  phoneNumber: Yup.string().matches(/^\+2547\d{8}$/, "Phone must be +2547XXXXXXXX").required(),
  password: Yup.string().min(6).optional(),
});

const AdminProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return <AdminLayout><div className="flex items-center justify-center min-h-screen">Loading profile...</div></AdminLayout>;

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const updateData = { ...values };
      if (!values.password) delete updateData.password;
      const token = localStorage.getItem("authToken");
      const res = await fetch(`https://afya-ke.onrender.com/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Admin Profile</h1>
        <p className="text-lg text-gray-600">Manage your profile details</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-lg">
        <Formik initialValues={{ fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber, password: "" }} validationSchema={ProfileSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting }) => (
            <Form>
              {["fullName","email","phoneNumber","password"].map(field => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm font-medium text-gray-700">{field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <Field type={field==="password"?"password":"text"} name={field} className="border p-2 w-full rounded" placeholder={field==="phoneNumber"?"+2547XXXXXXXX":""}/>
                  <ErrorMessage name={field} component="div" className="text-red-500 text-sm mt-1"/>
                </div>
              ))}
              <button type="submit" disabled={isSubmitting || loading} className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ${isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""}`}>Save Changes</button>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
