import React, { useRef, useState } from "react";
import ActionButton from "../ActionButton";

function UploadLectureImagesModal({
  isOpen,
  selectedImages,
  error,
  isSubmitting,
  onClose,
  onSubmit,
  onFileChange,
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const emitSelectedFiles = (files) => {
    onFileChange({ target: { files } });
  };

  const handleInputChange = (event) => {
    emitSelectedFiles(event.target.files || []);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    emitSelectedFiles(event.dataTransfer.files || []);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section className="surface w-full max-w-2xl p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-orange-950">Upload Lecture Images</h3>
            <p className="mt-1 text-sm text-orange-900/75">
              Add one or more lecture images to start chapter generation.
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
          <div>
            <span className="mb-1 block text-sm font-semibold text-orange-900">
              Select Images
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              className="sr-only"
              onChange={handleInputChange}
            />
            <div
              className={`cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
                isDragActive
                  ? "border-orange-500 bg-orange-100"
                  : "border-orange-300 bg-orange-50 hover:bg-orange-100/70"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <p className="text-sm font-semibold text-orange-900">
                Drag and drop images here
              </p>
              <p className="mt-1 text-xs text-orange-900/75">
                or click to browse files
              </p>
              {selectedImages.length > 0 ? (
                <p className="mt-3 text-xs font-semibold text-orange-900/80">
                  {selectedImages.length} image(s) ready to upload
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900/85">
            {selectedImages.length > 0
              ? `${selectedImages.length} image(s) selected`
              : "No images selected yet"}
          </div>

          {selectedImages.length > 0 ? (
            <ul className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-orange-200 bg-white px-3 py-2 text-sm text-orange-900">
              {selectedImages.map((file) => (
                <li key={`${file.name}-${file.size}`} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          ) : null}

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
              {isSubmitting ? "Uploading..." : "Upload Images"}
            </ActionButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default UploadLectureImagesModal;
