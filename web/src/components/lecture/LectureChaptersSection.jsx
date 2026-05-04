import React from "react";
import ReactMarkdown from "react-markdown";
import ActionButton from "../ActionButton";
import { chapterMarkdownComponents } from "./chapterMarkdownComponents";

function LectureChaptersSection({
  chapters,
  activeChapterIndex,
  onSelectChapter,
  activeChapter,
  onDownloadChapterPDF,
  isDownloadingChapterPDF = false,
}) {
  if (chapters.length === 0) {
    return (
      <section className="surface p-5 text-sm text-orange-900/80">
        No chapters generated yet for this lecture.
      </section>
    );
  }

  return (
    <section className="surface overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-orange-200 bg-orange-50/70 p-3 lg:border-b-0 lg:border-r">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-orange-700">
          Chapters
        </h2>
        <div className="space-y-1">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id || `${chapter.title}-${index}`}
              type="button"
              onClick={() => onSelectChapter(index)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                activeChapterIndex === index
                  ? "bg-orange-500 font-semibold text-white"
                  : "border border-orange-200 bg-white text-orange-900 hover:bg-orange-100"
              }`}
              style={{ cursor: "pointer" }}
            >
              {chapter.title || `Chapter ${index + 1}`}
            </button>
          ))}
        </div>
      </aside>

      <article className="p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-orange-200 pb-3">
          <h2 className="text-lg font-bold text-orange-950 md:text-xl">{activeChapter.title}</h2>
          <ActionButton
            type="button"
            variant="secondary"
            onClick={onDownloadChapterPDF}
            disabled={!activeChapter?.id || isDownloadingChapterPDF}
          >
            {isDownloadingChapterPDF ? "Downloading…" : "Download chapter PDF"}
          </ActionButton>
        </div>
        <div className="rounded-lg border border-orange-200 bg-white p-4 text-orange-900 md:p-5">
          <ReactMarkdown components={chapterMarkdownComponents}>
            {activeChapter.markdown}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  );
}

export default LectureChaptersSection;
