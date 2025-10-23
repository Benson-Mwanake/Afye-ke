import React from "react";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientDashboard from "./pages/PatientDashboard";
import ClinicBrowser from "./components/clinics/ClinicBrowser";
import ClinicDetail from "./components/clinics/ClinicDetail";
import SymptomChecker from "./components/symptomChecker/SymptomChecker";
import HealthEducation from "./features/HealthEducation";
import ArticleDetail from "./features/ArticleDetail";
import Profile from "./pages/Profile";
import ClinicDashboard from "./pages/ClinicDashboard";
import ClinicProfile from "./pages/ClinicProfile";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicApprovals from "./pages/ClinicApprovals";
import ArticleManagement from "./pages/ArticleManagement";
import CHVDashboard from "./components/chv/CHVDashboard";

function App() {
  // NOTE: This setup assumes you'll use react-router-dom for navigation.
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-inter">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
            <Route path="/clinic-profile" element={<ClinicProfile />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/clinic-approvals" element={<ClinicApprovals />} />
            <Route path="/manage-articles" element={<ArticleManagement />} />
            <Route path="/admin-reports" element={<AdminDashboard />} />
            <Route path="/find-clinics" element={<ClinicBrowser />} />
            <Route path="/clinics/:id" element={<ClinicDetail />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/health-tips" element={<HealthEducation />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/chv" element={<CHVDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
