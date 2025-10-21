// src/components/chv/AppointmentCard.jsx
import React, { useState } from "react";
import { useFetch } from "../../hooks/useAppHooks";

export default function AppointmentCard({ appointment }) {
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);
  const api = useFetch();

  const handleChangeStatus = async (newStatus) => {
    setLoading(true);
    try {
      const res = await api.patch(`/appointments/${appointment.id}`, {
        status: newStatus,
      });
      if (res.ok) {
        setStatus(res.data.status);
      } else {
        alert("Failed to update (mock)");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating");
    } finally {
      setLoading(false);
    }
  };

  const timePretty = appointment.time ? appointment.time : "—";

  return (
    <div className="app-card">
      <div>
        <div style={{ fontWeight: 700 }}>{appointment.patient_name}</div>
        <div className="small">
          {appointment.date} • {timePretty}
        </div>
        <div className="small">{appointment.type}</div>
      </div>
      <div
        style={{
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color:
              status === "confirmed" ? "var(--primary-green)" : "var(--muted)",
          }}
        >
          {status}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => handleChangeStatus("confirmed")}
          >
            Confirm
          </button>
          <button
            className="btn btn-ghost"
            disabled={loading}
            onClick={() => handleChangeStatus("cancelled")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
