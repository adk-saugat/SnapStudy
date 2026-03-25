import React from "react";
import ActionButton from "../ActionButton";

function LectureListSection({ lectureList }) {
  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Your Lectures</h2>
        <p className="text-sm text-orange-900/70">Open a lecture to view details.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lectureList.map((lecture) => (
          <article key={lecture.id} className="surface p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-orange-950 md:text-xl">
                {lecture.title}
              </h3>
              <span className="rounded-full bg-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-900">
                {lecture.files.length} files
              </span>
            </div>
            <p className="mt-1 text-sm text-orange-900/70">{lecture.updatedAt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-900">
                {lecture.chapters.length} chapters
              </span>
              <span className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-900">
                Uploaded {lecture.files.length} files
              </span>
            </div>
            <div className="mt-5 flex justify-end">
              <ActionButton to={`/dashboard/lectures/${lecture.id}`}>
                Open Lecture
              </ActionButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LectureListSection;
