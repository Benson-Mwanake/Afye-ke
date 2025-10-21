// src/components/chv/PatientList.jsx
import React, { useMemo, useState } from "react";

export default function PatientList({ patients = [] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.county || "").toLowerCase().includes(q)
    );
  }, [patients, query]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          placeholder="Search patient or county"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filtered.length === 0 && (
          <div className="small">No patients found.</div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="app-card">
            <div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div className="small">
                {p.county} • Last visit: {p.lastVisit}
              </div>
              <div className="small">Condition: {p.condition}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="small">Phone</div>
              <div style={{ fontWeight: 700 }}>{p.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
