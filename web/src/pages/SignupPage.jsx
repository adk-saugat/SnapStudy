import React, { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="page-shell">
      <SiteNav>
        <ActionButton to="/login" variant="secondary">
          Log In
        </ActionButton>
      </SiteNav>
      <main className="flex items-center justify-center px-4 py-10">
        <section className="surface w-full max-w-md p-6">
          <h1 className="text-3xl font-bold text-orange-950">
            Create Account
          </h1>
          <p className="text-muted mt-2 text-sm">
            Start organizing lecture notes and building your study library.
          </p>

          <form className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-orange-900">
                Full name
              </span>
              <input
                type="text"
                className="input-minimal"
                placeholder="Jane Doe"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-orange-900">
                Email
              </span>
              <input
                type="email"
                className="input-minimal"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-orange-900">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-minimal pr-16"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-semibold text-orange-700 hover:text-orange-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="pt-2">
              <ActionButton type="submit">Sign Up</ActionButton>
            </div>
          </form>

          <p className="mt-6 text-sm text-orange-900/75">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default SignupPage;
