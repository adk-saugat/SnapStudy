import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { loginUser } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      localStorage.setItem("snapstudy_user", JSON.stringify(response.user));
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteNav>
        <ActionButton to="/signup">Sign Up</ActionButton>
      </SiteNav>
      <main className="flex items-center justify-center px-4 py-10">
        <section className="surface w-full max-w-md p-6">
          <h1 className="text-3xl font-bold text-orange-950">Log In</h1>
          <p className="text-muted mt-2 text-sm">
            Welcome back! Access your lecture notes and continue studying.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-orange-900">
                Email
              </span>
              <input
                type="email"
                className="input-minimal"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, email: event.target.value }))
                }
                required
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
                  placeholder="********"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  required
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

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="pt-2">
              <ActionButton type="submit">
                {isSubmitting ? "Logging in..." : "Log In"}
              </ActionButton>
            </div>
          </form>

          <p className="mt-6 text-sm text-orange-900/80">
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
