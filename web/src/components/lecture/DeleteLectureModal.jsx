import React from "react";
import ActionButton from "../ActionButton";

function DeleteLectureModal({
  isOpen,
  lectureTitle,
  onConfirm,
  onClose,
  isDeleting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section className="surface w-full max-w-lg p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-orange-950">Delete Lecture</h3>
            <p className="mt-1 text-sm text-orange-900/75">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{lectureTitle || "this lecture"}</span>?
            </p>
            <p className="mt-1 text-sm text-red-700">This action cannot be undone.</p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            onClick={onClose}
            disabled={isDeleting}
          >
            Close
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <ActionButton type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </ActionButton>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-700 bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Lecture"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteLectureModal;
