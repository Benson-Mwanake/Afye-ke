import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import About from "../pages/About";
import Contact from "../pages/Contact";

// Protected Pages (Patient)
import ProtectedRoute from "../hooks/layouts/ProtectedRoute";
import DashboardLayout from "../hooks/layouts/DashboardLayout";

// Core Patient Pages
import PatientDashboard from "../pages/PatientDashboard";
import ClinicBrowser from "../components/clinics/ClinicBrowser";
import SymptomChecker from "../components/symptomChecker/SymptomChecker";
import Profile from "../pages/Profile";
import Appointments from "../pages/Appointments";
import ClinicDetail from "../components/clinics/ClinicDetail";
import AppointmentDetail from "../pages/AppointmentDetails";
import BookingFormWrapper from "../pages/BookingFormWrapper";

// Health & Education
import HealthTips from "../pages/HealthTips";
import AllHealthEducation from "../pages/AllHealthEducation";

// Additional Patient Pages
import SavedClinics from "../pages/SavedClinics";
import Articles from "../pages/Articles";
import Checkups from "../pages/Checkups";
import BookAppointment from "../pages/BookAppointment";

// Clinic Provider Pages
import ClinicDashboard from "../pages/ClinicDashboard";
import ClinicProfile from "../pages/ClinicProfile";
import ClinicSchedule from "../pages/ClinicSchedule";
import ClinicAvailability from "../pages/ClinicAvailability";
import ClinicPatients from "../pages/ClinicPatients";
import ClinicAnalytics from "../pages/ClinicAnalytics";
import ClinicReschedule from "../pages/ClinicReschedule";

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard";
import AdminApprovals from "../pages/AdminApprovals";
import AdminArticles from "../pages/AdminArticles";
import AdminReports from "../pages/AdminReports";
import AdminUsers from "../pages/AdminUsers";
import AdminProfile from "../pages/AdminProfile";

// Legacy
import HealthEducation from "../features/HealthEducation";

const AppRoutes = () => (
  <Routes>
    {/* === PUBLIC ROUTES === */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />

    {/* === PATIENT ROUTES === */}
    <Route
      path="/patient-dashboard"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/find-clinics"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <ClinicBrowser />
        </ProtectedRoute>
      }
    />
    <Route
      path="/symptom-checker"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <SymptomChecker />
        </ProtectedRoute>
      }
    />
    <Route
      path="/health-tips"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <HealthTips />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointments"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Appointments />
        </ProtectedRoute>
      }
    />
    <Route
      path="/saved-clinics"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <SavedClinics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/articles"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Articles />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkups"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Checkups />
        </ProtectedRoute>
      }
    />
    <Route
      path="/book-appointment"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <BookAppointment />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic/:id"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <ClinicDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointment/:id"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <AppointmentDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/booking/:id"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <DashboardLayout>
            <div className="max-w-2xl mx-auto py-8 px-4">
              <BookingFormWrapper />
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/all-health-education"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <AllHealthEducation />
        </ProtectedRoute>
      }
    />

    {/* === CLINIC PROVIDER ROUTES === */}
    <Route
      path="/clinic-dashboard"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-profile"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-schedule"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicSchedule />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-availability"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicAvailability />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-patients"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicPatients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-analytics"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clinic-reschedule/:id"
      element={
        <ProtectedRoute allowedRoles={["clinic"]}>
          <ClinicReschedule />
        </ProtectedRoute>
      }
    />

    {/* === ADMIN ROUTES === */}
    <Route
      path="/admin-dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-approvals"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminApprovals />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-articles"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminArticles />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-reports"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminReports />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-users"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin-profile"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminProfile />
        </ProtectedRoute>
      }
    />

    {/* === LEGACY === */}
    <Route
      path="/health-education"
      element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <HealthEducation />
        </ProtectedRoute>
      }
    />

    {/* === CATCH-ALL === */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const WrappedAppRoutes = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default WrappedAppRoutes;
