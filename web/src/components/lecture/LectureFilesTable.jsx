import React from "react";

function LectureFilesTable({ files, onDeleteFile, deletingFileId }) {
  return (
    <section className="surface mb-5 overflow-hidden">
      <div className="grid grid-cols-12 border-b border-orange-200 bg-orange-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-orange-800">
        <p className="col-span-12 md:col-span-6">Uploaded Files</p>
        <p className="col-span-3 hidden md:block">Type</p>
        <p className="col-span-2 hidden md:block">Size</p>
        <p className="col-span-1 hidden text-right md:block"> </p>
      </div>
      <ul>
        {files.length === 0 ? (
          <li className="px-5 py-3 text-sm text-orange-900/75">No files uploaded yet.</li>
        ) : null}
        {files.map((file) => (
          <li
            key={file.id}
            className="grid grid-cols-12 items-center border-b border-orange-100 px-5 py-3 text-sm last:border-b-0"
          >
            <div className="col-span-12 md:col-span-6">
              <p className="font-medium text-orange-950">{file.name}</p>
              <p className="mt-1 text-xs text-orange-900/70 md:hidden">
                {file.type} - {file.size}
              </p>
            </div>
            <p className="col-span-3 hidden text-orange-900/75 md:block">{file.type}</p>
            <p className="col-span-2 hidden font-medium md:block">{file.size}</p>
            <div className="col-span-1 hidden items-center justify-end md:flex">
              <button
                type="button"
                onClick={() => onDeleteFile?.(file.id)}
                disabled={deletingFileId === file.id}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-orange-300 bg-white text-orange-900 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Delete file"
              >
                {deletingFileId === file.id ? (
                  "..."
                ) : (
                  <>
                    <span aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </span>
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LectureFilesTable;
