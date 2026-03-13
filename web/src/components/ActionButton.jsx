import React from "react";

const variantClasses = {
  primary:
    "bg-orange-500 text-white shadow-sm hover:bg-orange-600 border border-transparent",
  secondary:
    "bg-white text-orange-900 border border-orange-200 hover:bg-orange-50",
};

function ActionButton({ children, variant = "primary", type = "button" }) {
  const resolvedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      type={type}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${resolvedVariant}`}
      style={{ cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

export default ActionButton;
