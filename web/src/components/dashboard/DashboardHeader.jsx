import React from "react";
import ActionButton from "../ActionButton";

function DashboardHeader({ username, logoutError, onOpenCreateLecture }) {
  return (
    <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
          Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">
          Welcome back, {username}
        </h1>
        <p className="mt-2 text-sm text-orange-900/75 md:text-base">
          Your lectures and notes in one place.
        </p>
        {logoutError ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {logoutError}
          </p>
        ) : null}
      </div>
      <div className="flex gap-3">
        <ActionButton onClick={onOpenCreateLecture}>Create Lecture</ActionButton>
      </div>
    </section>
  );
}

export default DashboardHeader;
