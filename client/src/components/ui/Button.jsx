import React from "react";

const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
