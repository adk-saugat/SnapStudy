import React from "react";
import { Link } from "react-router-dom";

function SiteNav({ children }) {
  return (
    <header className="sticky top-0 z-20 border-b border-orange-100 bg-orange-50/90 backdrop-blur">
      <div className="mx-auto flex w-[92vw] max-w-6xl items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]" />
          <span className="text-2xl font-black tracking-tight text-orange-900 md:text-3xl">
            SnapStudy
          </span>
        </Link>
        {children}
      </div>
    </header>
  );
}

export default SiteNav;
