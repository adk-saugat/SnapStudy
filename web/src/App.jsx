import React from "react";
import "./App.css";
import ActionButton from "./components/ActionButton";
import StepCard from "./components/StepCard";

function App() {
  const steps = [
    {
      title: "Create a Lecture",
      description:
        "After signing in, start a new lecture and give it a clear name so your notes stay organized by class.",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80",
      alt: "Student taking lecture photos with a phone",
    },
    {
      title: "Add Your Class Images",
      description:
        "Upload multiple photos from your phone or laptop, then wait while your notes are prepared in your lecture page.",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=80",
      alt: "Laptop screen showing processed text and note blocks",
    },
    {
      title: "Study, Edit, and Download",
      description:
        "Open your notes anytime, make quick edits, and download a PDF when you want an offline study copy.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
      alt: "Student reviewing digital notes while studying",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white text-orange-950">
      <header className="sticky top-0 z-20 border-b border-orange-100 bg-orange-50/90 backdrop-blur">
        <div className="mx-auto flex w-[92vw] max-w-6xl items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]" />
            <span className="text-2xl font-black tracking-tight text-orange-900 md:text-3xl">
              SnapStudy
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-orange-900/80 md:flex">
            <a href="#how-it-works" className="hover:text-orange-600">
              How It Works
            </a>
            <a href="#footer" className="hover:text-orange-600">
              Contact
            </a>
          </nav>
          <div className="flex flex-wrap gap-2">
            <ActionButton variant="secondary">Log In</ActionButton>
            <ActionButton>Sign Up</ActionButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[92vw] max-w-6xl">
        <section className="grid items-center gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-800">
              Built for your lecture-to-study workflow
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Organized lecture notes in minutes, not hours.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-orange-900/75 md:text-lg">
              Sign in, create a lecture, upload class photos, and get clean
              notes you can read anytime. Everything stays saved in your account
              so revising before exams is simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton>Get Started</ActionButton>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-xl shadow-orange-200/40">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
              alt="Student classroom lecture notes and laptop"
              className="h-full min-h-[300px] w-full object-cover"
            />
          </div>
        </section>

        <section id="how-it-works" className="py-10 md:py-14">
          <h2 className="text-3xl font-bold md:text-4xl">
            How students interact with SnapStudy
          </h2>
          <p className="mt-2 text-base text-orange-900/70">
            One simple flow from lecture photos to study-ready notes.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-orange-200 bg-orange-100/60 px-6 py-10 text-center md:mb-14">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-orange-900/75">
            Create your account, upload your class photos, and keep every
            lecture ready for quick revision.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ActionButton>Sign Up Free</ActionButton>
            <ActionButton variant="secondary">Log In</ActionButton>
          </div>
        </section>
      </main>

      <footer
        id="footer"
        className="border-t border-orange-200 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex w-[92vw] max-w-6xl flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-extrabold">SnapStudy</h3>
            <p className="text-sm text-orange-900/70">
              Lecture notes, simplified for students.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-orange-900/80">
            <a href="#how-it-works" className="hover:text-orange-600">
              How It Works
            </a>
            <a href="#" className="hover:text-orange-600">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-600">
              Terms
            </a>
          </div>
          <p className="text-sm text-orange-900/65">
            {new Date().getFullYear()} SnapStudy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
