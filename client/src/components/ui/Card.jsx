import React from "react";

const Card = ({ title, children, actions, className = "" }) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
};

export default Card;
