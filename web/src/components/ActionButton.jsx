import React from "react";
import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "bg-orange-500 text-white shadow-sm hover:bg-orange-600 border border-transparent",
  secondary:
    "bg-white text-orange-900 border border-orange-200 hover:bg-orange-50",
};

function ActionButton({
  children,
  variant = "primary",
  type = "button",
  to,
  onClick,
}) {
  const resolvedVariant = variantClasses[variant] || variantClasses.primary;
  const className = `rounded-full px-5 py-2.5 text-sm font-semibold transition ${resolvedVariant}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ActionButton;
