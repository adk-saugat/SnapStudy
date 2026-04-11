import React from "react";

function LectureFilesTable({ files }) {
  return (
    <section className="surface mb-5 overflow-hidden">
      <div className="grid grid-cols-12 border-b border-orange-200 bg-orange-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-orange-800">
        <p className="col-span-12 md:col-span-6">Uploaded Files</p>
        <p className="col-span-3 hidden md:block">Type</p>
        <p className="col-span-3 hidden md:block">Size</p>
      </div>
      <ul>
        {files.length === 0 ? (
          <li className="px-5 py-3 text-sm text-orange-900/75">No files uploaded yet.</li>
        ) : null}
        {files.map((file) => (
          <li
            key={file.name}
            className="grid grid-cols-12 items-center border-b border-orange-100 px-5 py-3 text-sm last:border-b-0"
          >
            <div className="col-span-12 md:col-span-6">
              <p className="font-medium text-orange-950">{file.name}</p>
              <p className="mt-1 text-xs text-orange-900/70 md:hidden">
                {file.type} - {file.size}
              </p>
            </div>
            <p className="col-span-3 hidden text-orange-900/75 md:block">{file.type}</p>
            <p className="col-span-3 hidden font-medium md:block">{file.size}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LectureFilesTable;
