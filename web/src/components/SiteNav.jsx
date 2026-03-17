import React from "react";
import { Link } from "react-router-dom";

function SiteNav({ children }) {
  return (
    <header className="border-b border-orange-200 bg-orange-50">
      <div className="mx-auto flex w-[92vw] max-w-6xl items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
          <span className="text-xl font-bold tracking-tight text-orange-900 md:text-2xl">
            SnapStudy
          </span>
        </Link>
        {children}
      </div>
    </header>
  );
}

export default SiteNav;
