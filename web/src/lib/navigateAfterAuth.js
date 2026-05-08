/**
 * After login or signup, route by premium access (paid or app trial).
 * @param {import('react-router-dom').NavigateFunction} navigate
 * @param {{ has_premium_access?: boolean, subscription_active?: boolean, trial_active?: boolean }} user
 */
export function navigateAfterAuth(navigate, user) {
  if (user?.has_premium_access || user?.subscription_active || user?.trial_active) {
    navigate("/dashboard", { replace: true });
  } else {
    navigate("/subscribe", { replace: true });
  }
}
