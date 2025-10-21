import React from "react";
import AppointmentCard from "./AppointmentCard";

const mockPatients = [
  {
    id: 1,
    name: "Amina Hussein",
    appointment: "2025-10-23",
    condition: "Fever",
  },
  {
    id: 2,
    name: "James Mwangi",
    appointment: "2025-10-24",
    condition: "Cough",
  },
];

const PatientList = () => (
  <div>
    <h3 className="text-lg font-semibold mb-3">Assigned Patients</h3>
    <div className="grid md:grid-cols-2 gap-4">
      {mockPatients.map((p) => (
        <AppointmentCard key={p.id} patient={p} />
      ))}
    </div>
  </div>
);

export default PatientList;
