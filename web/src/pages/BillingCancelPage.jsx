import React from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import SiteNav from "../components/SiteNav";

function BillingCancelPage() {
  return (
    <div className="page-shell">
      <SiteNav>
        <ActionButton to="/dashboard" variant="secondary">
          Dashboard
        </ActionButton>
      </SiteNav>
      <main className="flex items-center justify-center px-4 py-10">
        <section className="surface w-full max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-orange-950">Checkout canceled</h1>
          <p className="text-muted mt-3 text-sm">
            No charge was made. You need an active subscription to use lecture features.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <ActionButton to="/subscribe">Try checkout again</ActionButton>
            <Link
              to="/login"
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              Log in with another account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BillingCancelPage;
