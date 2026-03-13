import React from "react";
import { Navigate, useParams } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { lectures } from "../data/lectures";

function LectureDetailsPage() {
  const { lectureId } = useParams();
  const lecture = lectures.find((item) => item.id === lectureId);

  if (!lecture) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white text-orange-950">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton to="/dashboard" variant="secondary">
            Back to Dashboard
          </ActionButton>
          <ActionButton to="/login" variant="secondary">
            Log Out
          </ActionButton>
        </div>
      </SiteNav>

      <main className="mx-auto w-[96vw] max-w-360 py-8 md:py-10">
        <section className="rounded-3xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
            Lecture Details
          </p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            {lecture.title}
          </h1>
          <p className="mt-1 text-sm text-orange-900/70">{lecture.updatedAt}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton variant="secondary">Download Lecture PDF</ActionButton>
            <ActionButton>Upload More Files</ActionButton>
          </div>
        </section>

        <section className="mt-6">
          <article className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100 md:p-5">
            <h2 className="text-lg font-bold">Uploaded Files</h2>
            <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {lecture.files.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-semibold text-orange-950">{file.name}</p>
                    <p className="text-xs text-orange-900/70">{file.type}</p>
                  </div>
                  <span className="text-xs font-semibold text-orange-800">
                    {file.size}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-5">
          <article className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm shadow-orange-100 md:p-5">
            <h2 className="text-lg font-bold">Chapter Markdown</h2>
            <div className="mt-3 space-y-4">
              {lecture.chapters.map((chapter, index) => (
                <details
                  key={chapter.title}
                  className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 md:p-5"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-orange-950">
                        {chapter.title}
                      </h3>
                      <ActionButton
                        variant="secondary"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        Download Chapter PDF
                      </ActionButton>
                    </div>
                  </summary>
                  <div className="mt-3 flex flex-col gap-3">
                    <pre className="overflow-x-auto rounded-xl border border-orange-100 bg-white p-4 text-xs leading-6 whitespace-pre-wrap text-orange-900 md:p-5 md:text-sm">
                      {chapter.markdown}
                    </pre>
                  </div>
                </details>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default LectureDetailsPage;
