import React from "react";

const AppointmentCard = ({ patient }) => (
  <div className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition">
    <h4 className="font-bold text-blue-700">{patient.name}</h4>
    <p className="text-sm text-gray-600">Condition: {patient.condition}</p>
    <p className="text-sm text-gray-500">Appointment: {patient.appointment}</p>
    <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
      View Details
    </button>
  </div>
);

export default AppointmentCard;
