import React from "react";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import StepCard from "../components/StepCard";

function HomePage() {
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
    <div className="page-shell no-scrollbar h-screen overflow-y-auto">
      <SiteNav>
        <>
          <nav className="hidden items-center gap-6 text-sm font-medium text-orange-900/80 md:flex">
            <a href="#how-it-works" className="hover:text-orange-600">
              How It Works
            </a>
            <a href="#footer" className="hover:text-orange-600">
              Contact
            </a>
          </nav>
          <div className="flex flex-wrap gap-2">
            <ActionButton to="/login" variant="secondary">
              Log In
            </ActionButton>
            <ActionButton to="/signup">Sign Up</ActionButton>
          </div>
        </>
      </SiteNav>

      <main className="mx-auto w-[92vw] max-w-6xl">
        <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="inline-block rounded bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              Built for your lecture-to-study workflow
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Organized lecture notes in minutes, not hours.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-orange-900/75 md:text-lg">
              Sign in, create a lecture, upload class photos, and get clean
              notes you can read anytime. Everything stays saved in your account
              so revising before exams is simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton to="/signup">Get Started</ActionButton>
            </div>
          </div>
          <div className="surface overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
              alt="Student classroom lecture notes and laptop"
              className="h-full min-h-[300px] w-full object-cover"
            />
          </div>
        </section>

        <section id="how-it-works" className="py-8 md:py-12">
          <h2 className="text-2xl font-bold md:text-3xl">
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

        <section className="surface mb-10 bg-orange-100 px-6 py-8 text-center md:mb-14">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-orange-900/75">
            Create your account, upload your class photos, and keep every
            lecture ready for quick revision.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ActionButton to="/signup">Sign Up Free</ActionButton>
            <ActionButton to="/login" variant="secondary">
              Log In
            </ActionButton>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-orange-200 bg-orange-50">
        <div className="mx-auto flex w-[92vw] max-w-6xl flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold">SnapStudy</h3>
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

export default HomePage;
