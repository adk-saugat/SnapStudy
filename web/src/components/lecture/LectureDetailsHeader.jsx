import React from "react";
import ActionButton from "../ActionButton";

function LectureDetailsHeader({
  lecture,
  updatedAt,
  actionsMenuRef,
  isActionMenuOpen,
  onToggleActionMenu,
  onUploadImages,
  onEditLecture,
  onDeleteLecture,
  isDeletingLecture,
}) {
  return (
    <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
          Lecture Details
        </p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">{lecture.title}</h1>
        <p className="mt-2 max-w-3xl text-base leading-7 text-orange-900/80">
          {lecture.description || "No description provided."}
        </p>
        <p className="mt-2 text-sm text-orange-900/70">{updatedAt}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ActionButton variant="secondary">Download Lecture PDF</ActionButton>
        <ActionButton onClick={onUploadImages}>Upload Images</ActionButton>
        <div className="relative" ref={actionsMenuRef}>
          <button
            type="button"
            aria-label="Lecture actions"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-300 bg-white text-lg font-semibold text-orange-900 transition hover:bg-orange-100"
            onClick={onToggleActionMenu}
            style={{ cursor: "pointer" }}
          >
            &#8942;
          </button>
          {isActionMenuOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-orange-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-orange-900 hover:bg-orange-100"
                onClick={onEditLecture}
                style={{ cursor: "pointer" }}
              >
                Edit lecture
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                onClick={onDeleteLecture}
                style={{
                  cursor: isDeletingLecture ? "not-allowed" : "pointer",
                }}
                disabled={isDeletingLecture}
              >
                {isDeletingLecture ? "Deleting..." : "Delete lecture"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default LectureDetailsHeader;
