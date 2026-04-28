import React, { useState } from "react";

function LectureFilesTable({ files, onDeleteFile, deletingFileId }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <section className="surface mb-5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-orange-200 bg-orange-100 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-800">Uploaded Files</p>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex cursor-pointer items-center text-orange-900 transition hover:text-orange-700"
          aria-label={isCollapsed ? "Expand uploaded files" : "Collapse uploaded files"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="14"
            height="14"
            className={`transition-transform ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
        }`}
      >
        <>
          <div className="grid grid-cols-12 border-b border-orange-200 bg-orange-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
            <p className="col-span-12 md:col-span-6">File</p>
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
        </>
      </div>
    </section>
  );
}

export default LectureFilesTable;
