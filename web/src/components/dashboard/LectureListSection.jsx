import React from "react";
import ActionButton from "../ActionButton";

function LectureListSection({ lectureList, isLoading, error }) {
  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">Your Lectures</h2>
        <p className="text-sm text-orange-900/70">Open a lecture to view details.</p>
      </div>
      {error ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {isLoading ? (
        <p className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900/80">
          Loading your lectures...
        </p>
      ) : null}
      {!isLoading && lectureList.length === 0 ? (
        <p className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900/80">
          No lectures yet. Create your first lecture to get started.
        </p>
      ) : null}
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
            <p className="mt-2 line-clamp-2 text-sm text-orange-900/80">
              {lecture.description || "No description provided."}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-900">
                  {lecture.chapterCount ?? lecture.chapters.length ?? 0} chapters
                </span>
              </div>
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
