// src/components/chv/StatsOverview.jsx
import React, { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useAppHooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StatsOverview({ patients = [], appointments = [] }) {
  const fetcher = useFetch();
  const [chartData, setChartData] = useState([]);
  const totalPatients = patients.length;
  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const reportsPending = 0;

  useEffect(() => {
    (async () => {
      const res = await fetcher.get("/clinic/stats");
      if (res.ok) {
        setChartData(res.data.chartData);
      } else {
        const byCounty = patients.reduce((acc, p) => {
          acc[p.county] = (acc[p.county] || 0) + 1;
          return acc;
        }, {});
        setChartData(
          Object.entries(byCounty).map(([county, value]) => ({ county, value }))
        );
      }
    })();
  }, [patients]);

  const stats = [
    { title: "Patients", value: totalPatients, color: "var(--primary-green)" },
    {
      title: "Upcoming Visits",
      value: upcoming,
      color: "var(--secondary-blue)",
    },
    {
      title: "Reports (recent)",
      value: reportsPending,
      color: "var(--accent-red)",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <div key={s.title} className="stat">
            <div className="small">{s.title}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="surface" style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="small">Patients by County</div>
          <div className="small">Last 30 days</div>
        </div>

        <div style={{ width: "100%", height: 180, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="county" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary-green)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
