// src/pages/clinic/ClinicAvailability.jsx
import React, { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import ClinicDashboardLayout from "../hooks/layouts/ClinicLayout";

const ClinicAvailability = () => {
  const [slots, setSlots] = useState([
    { day: "Monday", start: "09:00", end: "17:00" },
    { day: "Tuesday", start: "09:00", end: "17:00" },
  ]);

  const addSlot = () => {
    setSlots([...slots, { day: "Monday", start: "09:00", end: "17:00" }]);
  };

  const removeSlot = (i) => {
    setSlots(slots.filter((_, index) => index !== i));
  };

    return (
    <ClinicDashboardLayout>
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Manage Availability
        </h1>

        <div className="space-y-4">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center space-x-3">
              <select className="px-3 py-2 border rounded-lg">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="time"
                defaultValue={slot.start}
                className="px-3 py-2 border rounded-lg"
              />
              <span className="text-gray-600">to</span>
              <input
                type="time"
                defaultValue={slot.end}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => removeSlot(i)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addSlot}
          className="mt-6 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Slot</span>
        </button>
      </div>
            </div>
    </ClinicDashboardLayout>
  );
};

export default ClinicAvailability;
