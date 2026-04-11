import React from "react";
import ActionButton from "../ActionButton";

function EditLectureModal({
  isOpen,
  editForm,
  onEditFormChange,
  onSubmit,
  onClose,
  isSaving,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section className="surface w-full max-w-lg p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-orange-950">Edit Lecture</h3>
            <p className="mt-1 text-sm text-orange-900/75">
              Update lecture title and description.
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            onClick={onClose}
            disabled={isSaving}
          >
            Close
          </button>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-orange-900">Lecture Title</span>
            <input
              type="text"
              className="input-minimal"
              value={editForm.title}
              onChange={(event) =>
                onEditFormChange((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-orange-900">Description</span>
            <textarea
              className="input-minimal min-h-24 resize-y"
              value={editForm.description}
              onChange={(event) =>
                onEditFormChange((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <ActionButton type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </ActionButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditLectureModal;
