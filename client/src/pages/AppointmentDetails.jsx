import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { BriefcaseMedical, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchAppointments } from "../services/userService";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAppointment = async () => {
      if (user && id) {
        try {
          const appointments = await fetchAppointments(user.email);
          const selectedAppointment = appointments.find(
            (a) => a.id === parseInt(id)
          );
          if (selectedAppointment) {
            setAppointment(selectedAppointment);
          } else {
            setError("Appointment not found.");
          }
        } catch (err) {
          setError("Failed to load appointment details.");
        } finally {
          setLoading(false);
        }
      }
    };
    loadAppointment();
  }, [user, id]);

  const handleBack = () => {
    navigate("/appointments");
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!appointment)
    return (
      <p className="text-center text-gray-500">
        No appointment data available.
      </p>
    );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Appointment Details
        </h1>
        <Card>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <BriefcaseMedical className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {appointment.clinicName}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <p className="text-gray-600">
                {appointment.location || "Location not specified"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <p className="text-gray-600">{appointment.date}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-teal-600" />
              <p className="text-gray-600">{appointment.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Doctor:</p>
              <p className="text-gray-600">
                {appointment.doctorName || "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Service:</p>
              <p className="text-gray-600">
                {appointment.service || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className="text-gray-600">Upcoming</p>{" "}
              {/* Could be dynamic based on date */}
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleBack}
              className="text-white bg-gray-600 hover:bg-gray-700"
            >
              Back to Appointments
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentDetail;
