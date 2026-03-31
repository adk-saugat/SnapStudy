const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const WEEK_IN_MS = 7 * DAY_IN_MS;

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "some time ago";

  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "some time ago";

  const diff = Date.now() - timestamp;
  if (diff < 0) return "just now";
  if (diff < MINUTE_IN_MS) return "just now";
  if (diff < HOUR_IN_MS) return pluralize(Math.floor(diff / MINUTE_IN_MS), "minute");
  if (diff < DAY_IN_MS) return pluralize(Math.floor(diff / HOUR_IN_MS), "hour");
  if (diff < WEEK_IN_MS) return pluralize(Math.floor(diff / DAY_IN_MS), "day");

  return pluralize(Math.floor(diff / WEEK_IN_MS), "week");
}
