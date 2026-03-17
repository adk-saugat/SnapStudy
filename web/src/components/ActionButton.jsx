import React from "react";
import { Link } from "react-router-dom";

const variantClasses = {
  primary:
    "bg-orange-500 text-white border border-orange-500 hover:bg-orange-600",
  secondary:
    "bg-white text-orange-900 border border-orange-300 hover:bg-orange-100",
};

function ActionButton({
  children,
  variant = "primary",
  type = "button",
  to,
  onClick,
}) {
  const resolvedVariant = variantClasses[variant] || variantClasses.primary;
  const className = `inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${resolvedVariant}`;

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
