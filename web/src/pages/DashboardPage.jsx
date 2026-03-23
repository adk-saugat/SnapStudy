import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { lectures } from "../data/lectures";
import { logoutUser } from "../api/authApi";

function getSavedUsername() {
  try {
    const savedUser = localStorage.getItem("snapstudy_user");
    if (!savedUser) return "Student";
    const parsedUser = JSON.parse(savedUser);
    return parsedUser?.username || "Student";
  } catch {
    return "Student";
  }
}

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const username = getSavedUsername();

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      await logoutUser();
      localStorage.removeItem("snapstudy_user");
      navigate("/login");
    } catch (error) {
      setLogoutError(error.message || "Unable to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <div className="page-shell">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={handleLogout} variant="secondary">
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </ActionButton>
        </div>
      </SiteNav>

      <main className="mx-auto w-[94vw] max-w-7xl py-8 md:py-10">
        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              Welcome back, {username}
            </h1>
            <p className="mt-2 text-sm text-orange-900/75 md:text-base">
              Your lectures and notes in one place.
            </p>
            {logoutError ? (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {logoutError}
              </p>
            ) : null}
          </div>
          <div className="flex gap-3">
            <ActionButton>Create Lecture</ActionButton>
          </div>
        </section>

        <section className="surface flex flex-wrap gap-2 p-3 text-sm">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-md bg-orange-100 px-3 py-1.5 text-orange-900"
            >
              <span className="mr-1.5 font-medium">{stat.label}:</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold md:text-2xl">Your Lectures</h2>
            <p className="text-sm text-orange-900/70">
              Open a lecture to view details.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {lectures.map((lecture) => (
              <article key={lecture.id} className="surface p-5">
                <h3 className="text-lg font-semibold text-orange-950 md:text-xl">
                  {lecture.title}
                </h3>
                <p className="mt-1 text-sm text-orange-900/70">
                  {lecture.updatedAt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-900">
                    {lecture.chapters.length} chapters
                  </span>
                  <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-900">
                    {lecture.files.length} files
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
      </main>
    </div>
  );
}

export default DashboardPage;
