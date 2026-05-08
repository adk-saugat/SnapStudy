export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function fetchBillingStatus() {
  const response = await fetch(`${API_BASE_URL}/billing/status`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.error || data?.message || "Billing status request failed";
    throw new Error(message);
  }

  return data;
}

export async function startFreeTrial() {
  const response = await fetch(`${API_BASE_URL}/billing/start-trial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Unable to start free trial";
    throw new Error(message);
  }

  return data;
}

export async function syncCheckoutSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/billing/sync-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ session_id: sessionId }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Could not sync checkout";
    throw new Error(message);
  }

  return data;
}

export async function createCheckoutSession() {
  const response = await fetch(`${API_BASE_URL}/billing/checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || data?.message || "Unable to start checkout";
    throw new Error(message);
  }

  return data;
}
