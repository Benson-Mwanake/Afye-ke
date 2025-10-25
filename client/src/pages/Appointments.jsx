import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ListItem from "../components/ui/ListItem";
import { BriefcaseMedical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchAppointments } from "../services/userService";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        try {
          const data = await fetchAppointments(user.email);
          setAppointments(data);
        } catch (error) {
          console.error("Failed to load appointments:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAppointments();
  }, [user]);

  const handleBookAppointment = () => {
    navigate("/clinic-browser");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Appointments
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          {user?.role === "doctor"
            ? "Manage your appointment schedule."
            : "View your upcoming appointments."}
        </p>
        <Card>
          {loading ? (
            <p className="text-center text-gray-500">Loading appointments...</p>
          ) : appointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {appointments.map((appointment) => (
                <ListItem
                  key={appointment.id}
                  icon={BriefcaseMedical}
                  title={appointment.clinicName || "Unknown Clinic"}
                  subtitle={`${appointment.doctorName || "Unknown Doctor"} • ${
                    appointment.service || "N/A"
                  } • ${appointment.date} @ ${appointment.time}`}
                  action={
                    <Button
                      onClick={() => navigate(`/appointment/${appointment.id}`)}
                      className="text-green-600 border border-green-600 hover:bg-green-50"
                    >
                      Details
                    </Button>
                  }
                />
              ))}
              <p className="text-sm text-gray-400 pt-4">
                Showing {appointments.length} appointment(s). See all for
                history.
              </p>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl shadow-md border border-gray-100">
              <BriefcaseMedical className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-xl text-gray-600">
                No appointments scheduled yet.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Book an appointment to get started.
              </p>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={handleBookAppointment}
              className="text-white bg-green-600 hover:bg-green-700"
            >
              Book New Appointment
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
