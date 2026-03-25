import React from "react";
import ActionButton from "../ActionButton";

function CreateLectureModal({
  isOpen,
  form,
  error,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section className="surface w-full max-w-lg p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-orange-950">Create Lecture</h3>
            <p className="mt-1 text-sm text-orange-900/75">
              Add a lecture title and optional description.
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-orange-900">
              Lecture Title
            </span>
            <input
              type="text"
              className="input-minimal"
              placeholder="e.g. Data Structures - Trees"
              value={form.title}
              onChange={(event) => onChange("title", event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-orange-900">
              Description (Optional)
            </span>
            <textarea
              className="input-minimal min-h-24 resize-y"
              placeholder="Add a short overview for this lecture"
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
            />
          </label>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <ActionButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton type="submit">
              {isSubmitting ? "Creating..." : "Create"}
            </ActionButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateLectureModal;
