import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

/**
 * A row component for displaying a single past or upcoming appointment/event.
 * @param {object} props
 * @param {string} props.clinic - Name of the clinic (or just 'Clinic' if used on the clinic dashboard).
 * @param {string} props.doctor - Name of the doctor/provider OR the Patient Name (for clinic view).
 * @param {string} props.date - Date of the appointment/event.
 * @param {string} props.status - Status (e.g., 'Completed', 'Upcoming', 'Cancelled').
 */
const AppointmentHistoryRow = ({ clinic, doctor, date, status }) => {
  const isCompleted = status === "Completed";
  const isUpcoming =
    status.toLowerCase().includes("upcoming") ||
    status.toLowerCase().includes("scheduled");
  const isCancelled = status === "Cancelled";

  let statusClass = "text-gray-500 bg-gray-100";
  let StatusIcon = Clock;

  if (isCompleted) {
    statusClass = "text-green-700 bg-green-100";
    StatusIcon = CheckCircle;
  } else if (isCancelled) {
    statusClass = "text-red-700 bg-red-100";
    StatusIcon = XCircle;
  } else if (isUpcoming) {
    statusClass = "text-blue-700 bg-blue-100";
    StatusIcon = Clock;
  }

  return (
    <div className="py-4 flex justify-between items-center hover:bg-gray-50 transition duration-100 rounded-lg -mx-2 px-2">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{clinic}</span>
        <span className="text-sm text-gray-600">{doctor}</span>
        <span className="text-xs text-gray-500 mt-1">{date}</span>
      </div>

      <div
        className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${statusClass}`}
      >
        <StatusIcon className="w-3 h-3 mr-1" />
        {status}
      </div>
    </div>
  );
};

export default AppointmentHistoryRow;
