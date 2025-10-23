import React from "react";
import { Edit } from "lucide-react";

/**
 * InputWithLabel Component
 * Displays data in a read-only format or as an editable input field.
 *
 * @param {string} label - The label for the field (e.g., "Full Name").
 * @param {string} value - The current value of the field.
 * @param {boolean} isEditing - If true, displays an input field; otherwise, displays static text.
 * @param {function} onChange - Handler for input changes.
 * @param {string} type - Input type (e.g., 'text', 'email', 'date').
 * @param {boolean} disabled - Whether the input is disabled (used for read-only sections).
 */
const InputWithLabel = ({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing && !disabled ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 text-gray-800"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <div
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium overflow-hidden truncate"
          title={value} // Tooltip for truncated text
        >
          {value || <span className="text-gray-400 italic">N/A</span>}
        </div>
      )}
    </div>
  );
};

export default InputWithLabel;
