import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";
import { API_BASE_URL, syncCheckoutSession } from "../api/billingApi";

function mergeBillingIntoStorage(status) {
  try {
    const raw = localStorage.getItem("snapstudy_user");
    if (!raw) return;
    const user = JSON.parse(raw);
    user.subscription_active = status.subscription_active;
    user.trial_active = status.trial_active;
    user.has_premium_access = status.has_premium_access;
    if (status.trial_ends_at) {
      user.trial_ends_at = status.trial_ends_at;
    }
    localStorage.setItem("snapstudy_user", JSON.stringify(user));
  } catch {
    // ignore
  }
}

function BillingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("waiting");
  const [message, setMessage] = useState(
    "Confirming your subscription… this usually takes a few seconds.",
  );

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      while (!cancelled && attempts < maxAttempts) {
        attempts += 1;
        try {
          if (sessionId) {
            try {
              const synced = await syncCheckoutSession(sessionId);
              if (!cancelled && synced?.has_premium_access) {
                mergeBillingIntoStorage(synced);
                navigate("/dashboard", { replace: true });
                return;
              }
            } catch (syncErr) {
              if (!cancelled && attempts === 1) {
                const msg = syncErr instanceof Error ? syncErr.message : "Sync failed";
                setMessage(`${msg} — retrying from your account status…`);
              }
            }
          }

          const statusRes = await fetch(`${API_BASE_URL}/billing/status`, {
            method: "GET",
            credentials: "include",
          });
          const data = await statusRes.json().catch(() => ({}));

          if (statusRes.status === 401) {
            if (!cancelled) {
              setStatus("error");
              setMessage(
                "Your session expired or the API URL does not match where you signed in. Sign in again (use the same host in VITE_API_URL as in the browser).",
              );
            }
            return;
          }

          if (statusRes.ok && data?.has_premium_access) {
            mergeBillingIntoStorage(data);
            if (!cancelled) {
              navigate("/dashboard", { replace: true });
            }
            return;
          }
        } catch (err) {
          if (!cancelled && attempts === 1) {
            setMessage(
              "Still confirming… if this takes too long, check that your API URL matches the app (same host as login).",
            );
          }
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) {
        setStatus("timeout");
        setMessage(
          "We could not confirm payment yet. Open your dashboard from the nav, or ensure Stripe keys and API URL (VITE_API_URL) point at this backend.",
        );
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [navigate, sessionId]);

  return (
    <div className="page-shell">
      <SiteNav>
        <ActionButton to="/dashboard" variant="secondary">
          Dashboard
        </ActionButton>
      </SiteNav>
      <main className="flex items-center justify-center px-4 py-10">
        <section className="surface w-full max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-orange-950">Payment received</h1>
          <p className="text-muted mt-3 text-sm">{message}</p>
          {status === "error" ? (
            <p className="mt-6 text-sm">
              <Link to="/login" className="font-semibold text-orange-600 hover:underline">
                Sign in
              </Link>
            </p>
          ) : null}
          {status === "timeout" ? (
            <p className="mt-6 text-sm">
              <Link to="/subscribe" className="font-semibold text-orange-600 hover:underline">
                Back to subscribe
              </Link>
            </p>
          ) : null}
          {status === "waiting" ? (
            <p className="mt-6 text-xs text-orange-900/60">
              Still waiting? You can open the{" "}
              <Link to="/dashboard" className="font-semibold text-orange-600 hover:underline">
                dashboard
              </Link>{" "}
              after your payment finishes processing.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default BillingSuccessPage;
