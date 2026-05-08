import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { createCheckoutSession, startFreeTrial } from "../api/billingApi";
import { logoutUser } from "../api/authApi";

const proPrice = import.meta.env.VITE_PLAN_PRICE_MAIN?.trim() || "$5";
const proPriceDetail =
  import.meta.env.VITE_PLAN_PRICE_DETAIL?.trim() || "USD · billed monthly · cancel anytime";

const trialDaysRaw = import.meta.env.VITE_TRIAL_DAYS?.trim();
const trialDays = (() => {
  const n = parseInt(trialDaysRaw ?? "14", 10);
  return Number.isFinite(n) && n > 0 ? n : 14;
})();

function applyBillingToStorage(data) {
  try {
    const raw = localStorage.getItem("snapstudy_user");
    if (!raw) return;
    const user = JSON.parse(raw);
    if (typeof data.subscription_active === "boolean") {
      user.subscription_active = data.subscription_active;
    }
    if (typeof data.trial_active === "boolean") {
      user.trial_active = data.trial_active;
    }
    if (typeof data.has_premium_access === "boolean") {
      user.has_premium_access = data.has_premium_access;
    }
    if (data.trial_ends_at) {
      user.trial_ends_at = data.trial_ends_at;
    }
    localStorage.setItem("snapstudy_user", JSON.stringify(user));
  } catch {
    // ignore
  }
}

function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className}>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-7.5 10.5a.75.75 0 01-1.127.077l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 6.951-9.73a.75.75 0 011.052-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const proFeatures = [
  "Unlimited lectures and chapter notes",
  "Upload class images and AI-formatted study notes",
  "Download full lecture PDFs for offline review",
  "Library synced securely to your account",
];

const trialFeatures = [
  `Full Pro features for ${trialDays} days — no card, no checkout`,
  "Same lectures, uploads, chapters, and PDFs as paid Pro",
  `When it ends, subscribe with Pro (${proPrice}/month) or pause until you’re ready`,
];

function SubscribePage() {
  const navigate = useNavigate();
  const [checkoutError, setCheckoutError] = useState("");
  const [trialError, setTrialError] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isTrialLoading, setIsTrialLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCheckout = async () => {
    setCheckoutError("");
    setIsCheckoutLoading(true);
    try {
      const { url } = await createCheckoutSession();
      if (url) {
        window.location.href = url;
        return;
      }
      setCheckoutError("Checkout did not return a URL.");
    } catch (checkoutErr) {
      setCheckoutError(checkoutErr.message || "Unable to start checkout.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setTrialError("");
    setIsTrialLoading(true);
    try {
      const data = await startFreeTrial();
      applyBillingToStorage(data);
      navigate("/dashboard", { replace: true });
    } catch (trialErr) {
      setTrialError(trialErr.message || "Unable to start trial.");
    } finally {
      setIsTrialLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      localStorage.removeItem("snapstudy_user");
      navigate("/login", { replace: true });
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="page-shell">
      <SiteNav>
        <div className="flex flex-wrap gap-2">
          <ActionButton type="button" variant="secondary" onClick={handleLogout}>
            {isLoggingOut ? "Logging out…" : "Log out"}
          </ActionButton>
        </div>
      </SiteNav>
      <main className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-center text-3xl font-bold text-orange-950">Choose your plan</h1>
          <p className="text-muted mx-auto mt-2 max-w-xl text-center text-sm">
            Start with a free app trial or subscribe to Pro for uninterrupted access.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-stretch">
            <section className="surface flex h-full flex-col rounded-2xl p-7 sm:p-8">
              <h2 className="text-xl font-semibold text-orange-950">Free trial</h2>
              <p className="text-muted mt-1 text-sm">
                Try everything at no cost for {trialDays} days. No payment method required.
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-orange-950">
                {trialFeatures.map((line) => (
                  <li key={line} className="flex gap-2">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {trialError ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {trialError}
                </p>
              ) : null}
              <div className="mt-6">
                <ActionButton type="button" variant="secondary" onClick={handleStartTrial}>
                  {isTrialLoading ? "Starting trial…" : `Start ${trialDays}-day free trial`}
                </ActionButton>
              </div>
            </section>

            <section className="surface flex h-full flex-col rounded-2xl p-7 sm:p-8 ring-2 ring-orange-200">
              <h2 className="text-xl font-semibold text-orange-950">Pro</h2>
              <p className="mt-1 text-2xl font-bold text-orange-950">
                {proPrice}
                <span className="text-muted text-base font-normal"> /month</span>
              </p>
              <p className="text-muted text-sm">{proPriceDetail}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-orange-950">
                {proFeatures.map((line) => (
                  <li key={line} className="flex gap-2">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {checkoutError ? (
                <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {checkoutError}
                </p>
              ) : null}
              <div className="mt-6">
                <ActionButton type="button" onClick={handleCheckout}>
                  {isCheckoutLoading ? "Opening checkout…" : `Pay ${proPrice}/month`}
                </ActionButton>
              </div>
              <p className="text-muted mt-3 text-center text-xs">
                Secure checkout. Cancel anytime from your billing provider.
              </p>
            </section>
          </div>

          <p className="mt-8 text-center text-sm text-orange-900/75">
            <Link to="/login" className="font-semibold text-orange-600 hover:underline">
              Use a different account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SubscribePage;
