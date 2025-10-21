// src/components/chv/ReportForm.jsx
import React, { useState } from "react";
import { useFetch, useAuth, useSendGrid } from "../../hooks/useAppHooks";

export default function ReportForm({ onSubmitted = () => {}, patients = [] }) {
  const { user } = useAuth();
  const api = useFetch();
  const { sendEmail } = useSendGrid();
  const [patientId, setPatientId] = useState(patients[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setMsg({ type: "error", text: "Please add notes" });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const patient = patients.find((p) => p.id === Number(patientId));
      const payload = {
        patient_id: patient?.id || null,
        patient_name: patient?.name || "Unknown",
        summary: notes,
        date: new Date().toISOString().slice(0, 10),
        chv_id: user?.id || 1,
      };
      const res = await api.post("/chv/reports", payload);
      if (!res.ok) throw new Error(res.error || "failed");
      setMsg({ type: "success", text: "Report submitted" });
      onSubmitted(res.data);

      try {
        await sendEmail({
          to: "admin@afyalink.ke",
          subject: `New CHV report for ${payload.patient_name}`,
          html: `<p>${payload.summary}</p><p>Reported by ${user?.full_name}</p>`,
        });
      } catch (err) {
        console.warn("mock email failed", err);
      }
      setNotes("");
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: err.message || "Submit failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface">
      <h3 style={{ marginTop: 0 }}>Submit Field Report</h3>
      <form onSubmit={submit}>
        <label className="form-label">Patient</label>
        <select
          className="input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">-- select patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.county})
            </option>
          ))}
        </select>

        <label className="form-label" style={{ marginTop: 8 }}>
          Notes
        </label>
        <textarea
          rows={5}
          className="input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {msg && (
          <div
            style={{
              marginTop: 8,
              color: msg.type === "error" ? "var(--danger)" : "var(--success)",
            }}
          >
            {msg.text}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
