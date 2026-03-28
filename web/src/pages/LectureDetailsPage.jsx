import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { fetchUserLectures } from "../api/lectureApi";

function LectureDetailsPage() {
  const { lectureId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    const loadLectures = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetchUserLectures();
        const fetchedLectures = Array.isArray(response?.lectures) ? response.lectures : [];
        setLectures(fetchedLectures);
      } catch (error) {
        setLoadError(error.message || "Unable to load lecture details");
      } finally {
        setIsLoading(false);
      }
    };

    loadLectures();
  }, []);

  const lecture = useMemo(
    () => lectures.find((item) => item.id === lectureId),
    [lectures, lectureId],
  );

  const chapters = lecture?.chapters || [];
  const files = lecture?.files || [];
  const activeChapter = chapters[activeChapterIndex];
  const updatedAt = lecture?.updated_at
    ? `Updated ${new Date(lecture.updated_at).toLocaleString()}`
    : "Updated time unavailable";

  useEffect(() => {
    setActiveChapterIndex(0);
  }, [lectureId]);

  return (
    <div className="page-shell">
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
        {isLoading ? (
          <p className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900/80">
            Loading lecture details...
          </p>
        ) : null}
        {loadError ? (
          <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {loadError}
          </p>
        ) : null}
        {!isLoading && !loadError && !lecture ? (
          <section className="mb-6 rounded-md border border-orange-200 bg-orange-50 px-4 py-3">
            <h1 className="text-lg font-semibold text-orange-950">Lecture not found</h1>
            <p className="mt-1 text-sm text-orange-900/80">
              This lecture may have been deleted or is unavailable.
            </p>
          </section>
        ) : null}

        {lecture ? (
          <>
        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
              Lecture Details
            </p>
            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              {lecture.title}
            </h1>
            <p className="mt-1 text-sm text-orange-900/70">{updatedAt}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="secondary">Download Lecture PDF</ActionButton>
            <ActionButton>Upload More Files</ActionButton>
          </div>
        </section>

        <section className="surface mb-5 overflow-hidden">
          <div className="grid grid-cols-12 border-b border-orange-200 bg-orange-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-orange-800">
            <p className="col-span-12 md:col-span-6">Uploaded Files</p>
            <p className="col-span-3 hidden md:block">Type</p>
            <p className="col-span-3 hidden md:block">Size</p>
          </div>
          <ul>
            {files.length === 0 ? (
              <li className="px-5 py-3 text-sm text-orange-900/75">
                No files uploaded yet.
              </li>
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
                <p className="col-span-3 hidden text-orange-900/75 md:block">
                  {file.type}
                </p>
                <p className="col-span-3 hidden font-medium md:block">{file.size}</p>
              </li>
            ))}
          </ul>
        </section>

        {chapters.length > 0 ? (
          <section className="surface overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-orange-200 bg-orange-50/70 p-3 lg:border-b-0 lg:border-r">
            <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
              Chapters
            </h2>
            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.title}
                  type="button"
                  onClick={() => setActiveChapterIndex(index)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    activeChapterIndex === index
                      ? "bg-orange-500 font-semibold text-white"
                      : "border border-orange-200 bg-white text-orange-900 hover:bg-orange-100"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  Chapter {index + 1}
                </button>
              ))}
            </div>
          </aside>

          <article className="p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-orange-200 pb-3">
              <h2 className="text-lg font-bold text-orange-950 md:text-xl">
                {activeChapter.title}
              </h2>
              <ActionButton variant="secondary">Download Chapter PDF</ActionButton>
            </div>
            <div className="rounded-lg border border-orange-200 bg-white p-4 text-orange-900 md:p-5">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="mb-3 text-lg font-bold md:text-xl">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-4 text-base font-semibold md:text-lg">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-sm leading-6 md:text-base">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-6 md:text-base">
                      {children}
                    </ul>
                  ),
                  code: ({ children }) => (
                    <code className="rounded bg-orange-100 px-1.5 py-0.5 font-mono text-xs text-orange-950 md:text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="mb-3 overflow-x-auto rounded-lg border border-orange-100 bg-orange-50 p-3">
                      {children}
                    </pre>
                  ),
                }}
              >
                {activeChapter.markdown}
              </ReactMarkdown>
            </div>
          </article>
          </section>
        ) : (
          <section className="surface p-5 text-sm text-orange-900/80">
            No chapters generated yet for this lecture.
          </section>
        )}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default LectureDetailsPage;
