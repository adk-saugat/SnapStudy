import React from "react";

function LectureDetailsAlerts({
  isLoading,
  loadError,
  actionError,
  showNotFound,
}) {
  return (
    <>
      {isLoading ? (
        <p className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900/80">
          Loading lecture details...
        </p>
      ) : null}
      {loadError ? (
        <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadError}
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}
      {showNotFound ? (
        <section className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3">
          <h1 className="text-lg font-semibold text-orange-950">Lecture not found</h1>
          <p className="mt-1 text-sm text-orange-900/80">
            This lecture may have been deleted or is unavailable.
          </p>
        </section>
      ) : null}
    </>
  );
}

export default LectureDetailsAlerts;
