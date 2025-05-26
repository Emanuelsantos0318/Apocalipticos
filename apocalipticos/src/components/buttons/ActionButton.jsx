// components/buttons/ActionButton.jsx
import React from "react"; // Adicione esta linha
export default function ActionButton({ children, onClick, disabled, theme }) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors w-full";
  
  const themeClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    disabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
    ready: "bg-green-600 hover:bg-green-700 text-white",
    "not-ready": "bg-yellow-600 hover:bg-yellow-700 text-white",
    danger: "bg-red-500 hover:bg-red-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${themeClasses[theme]}`}
    >
      {children}
    </button>
  );
}