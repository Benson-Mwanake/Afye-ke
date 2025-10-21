// src/components/chv/CHVDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth, useFetch } from "../../hooks/useAppHooks";
import StatsOverview from "./StatsOverview";
import PatientList from "./PatientList";
import ReportForm from "./ReportForm";
import AppointmentCard from "./AppointmentCard";

export default function CHVDashboard() {
  const { user } = useAuth();
  const fetcher = useFetch();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const chv_id = user?.id || 1;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const p = await fetcher.get(`/chv/patients?chv_id=${chv_id}`);
      const a = await fetcher.get(`/chv/appointments?chv_id=${chv_id}`);
      const r = await fetcher.get(`/chv/reports?chv_id=${chv_id}`);
      if (!mounted) return;
      if (p.ok) setPatients(p.data);
      if (a.ok) setAppointments(a.data);
      if (r.ok) setReports(r.data);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleReportSubmitted = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };

  return (
    <div className="container">
      <div className="chv-header">
        <div>
          <h1 style={{ margin: 0 }}>CHV Dashboard</h1>
          <div className="small">
            Welcome back — manage your patients and reports
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "var(--primary-green)" }}>
            {user?.full_name || "CHV"}
          </div>
          <div className="small">{user?.county || "-"}</div>
        </div>
      </div>

      <div className="mt-6">
        <StatsOverview patients={patients} appointments={appointments} />
      </div>

      <div className="mt-6 grid-2">
        <div>
          <div className="surface">
            <h3 style={{ marginTop: 0 }}>Today's Appointments</h3>
            {loading && <div className="small">Loading...</div>}
            {!loading && appointments.length === 0 && (
              <div className="small">No appointments scheduled.</div>
            )}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {appointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          </div>

          <div className="mt-6 surface">
            <h3 style={{ marginTop: 0 }}>Assigned Patients</h3>
            <PatientList patients={patients} />
          </div>
        </div>

        <aside>
          <ReportForm onSubmitted={handleReportSubmitted} patients={patients} />
          <div className="mt-6 surface">
            <h4 style={{ marginTop: 0 }}>Recent Reports</h4>
            {reports.slice(0, 5).map((r) => (
              <div key={r.id} className="app-card" style={{ marginTop: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.patient_name}</div>
                  <div className="small">{r.summary}</div>
                </div>
                <div className="small" style={{ textAlign: "right" }}>
                  {r.date}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
