// src/pages/Appointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../hooks/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ListItem from "../components/ui/ListItem";
import { BriefcaseMedical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clinicsMap, setClinicsMap] = useState({});

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        // AUTHENTICATED: uses api → JWT included
        const apptRes = await api.get("/appointments/", {
          params: { patientId: user.id },
        });
        setAppointments(apptRes.data);

        // PUBLIC: fetch clinics
        const clinicsRes = await fetch("https://gadgetreview-5c3b.onrender.com/clinics");
        const clinics = clinicsRes.ok ? await clinicsRes.json() : [];
        const map = {};
        clinics.forEach((c) => (map[c.id] = c.name));
        setClinicsMap(map);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Appointments
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          View your upcoming and past appointments.
        </p>

        <Card>
          {loading ? (
            <p className="text-center py-4 text-gray-500">Loading...</p>
          ) : appointments.length ? (
            <div className="divide-y divide-gray-100">
              {appointments.map((a) => (
                <ListItem
                  key={a.id}
                  icon={BriefcaseMedical}
                  title={clinicsMap[a.clinicId] || a.clinicName || "Unknown"}
                  subtitle={`${a.doctor || "Dr. Not Assigned"} • ${
                    a.service || "N/A"
                  } • ${a.date} @ ${a.time}`}
                  action={
                    <Button
                      onClick={() => navigate(`/appointment/${a.id}`)}
                      className="text-green-600 border border-green-600 hover:bg-green-50"
                    >
                      Details
                    </Button>
                  }
                />
              ))}
              <p className="pt-4 text-sm text-gray-400">
                {appointments.length} appointment(s)
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <BriefcaseMedical className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-xl text-gray-600">No appointments yet.</p>
              <Button
                onClick={() => navigate("/clinic-browser")}
                className="mt-4 bg-green-600 text-white hover:bg-green-700"
              >
                Book Now
              </Button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
