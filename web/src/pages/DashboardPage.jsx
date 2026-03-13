import React from "react";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { lectures } from "../data/lectures";

function DashboardPage() {
  const stats = [
    { label: "Lectures", value: lectures.length },
    {
      label: "Uploaded Files",
      value: lectures.reduce(
        (total, lecture) => total + lecture.files.length,
        0,
      ),
    },
    {
      label: "Chapters",
      value: lectures.reduce(
        (total, lecture) => total + lecture.chapters.length,
        0,
      ),
    },
    { label: "Exports", value: "14" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white text-orange-950">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton to="/login" variant="secondary">
            Log Out
          </ActionButton>
        </div>
      </SiteNav>

      <main className="mx-auto w-[94vw] max-w-7xl py-8 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_55%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Welcome back, Student
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-orange-900/75 md:text-base">
              Manage your lectures from one place. Open a lecture card to see
              all uploaded files, chapter markdown notes, and PDF download
              options on the dedicated details page.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton>Create Lecture</ActionButton>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm shadow-orange-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-black text-orange-950">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-2xl">Your Lectures</h2>
            <p className="text-sm text-orange-900/70">
              Select a card to open lecture details.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {lectures.map((lecture) => (
              <article
                key={lecture.id}
                className="rounded-3xl border border-orange-200 bg-white p-5 shadow-sm shadow-orange-100"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                  Lecture
                </p>
                <h3 className="mt-1 text-xl font-bold md:text-2xl">
                  {lecture.title}
                </h3>
                <p className="mt-1 text-sm text-orange-900/70">
                  {lecture.updatedAt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-orange-900/80">
                  <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold">
                    {lecture.files.length} files
                  </span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold">
                    {lecture.chapters.length} chapters
                  </span>
                </div>
                <div className="mt-5 flex justify-end">
                  <ActionButton to={`/dashboard/lectures/${lecture.id}`}>
                    Open Details
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
