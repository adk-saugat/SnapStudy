import React, { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-amber-50 to-white">
      <SiteNav>
        <ActionButton to="/signup">Sign Up</ActionButton>
      </SiteNav>
      <main className="flex items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border border-orange-200 bg-white p-6 shadow-lg shadow-orange-100">
          <h1 className="text-3xl font-extrabold text-orange-950">Log In</h1>
          <p className="mt-2 text-sm text-orange-900/70">
            Welcome back! Access your lecture notes and continue studying.
          </p>

          <form className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-orange-900">
                Email
              </span>
              <input
                type="email"
                className="w-full rounded-xl border border-orange-200 px-3 py-2 text-sm outline-none ring-orange-300 transition focus:ring-2"
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
                  className="w-full rounded-xl border border-orange-200 px-3 py-2 pr-16 text-sm outline-none ring-orange-300 transition focus:ring-2"
                  placeholder="********"
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
              <ActionButton type="submit">Log In</ActionButton>
            </div>
          </form>

          <p className="mt-6 text-sm text-orange-900/75">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-orange-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
