// src/utils/dateUtils.js
// Helpers for working with local date keys in YYYY-MM-DD format.

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

/**
 * Convert a Date object (or "now" if omitted) into a local date key "YYYY-MM-DD".
 */
export function getLocalDateKey(date) {
  const d = date instanceof Date ? date : new Date();
  if (isNaN(d.getTime())) {
    return "";
  }
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * Validate that a string is a real calendar date in YYYY-MM-DD format.
 */
export function isValidDateKey(dateKey) {
  if (typeof dateKey !== "string") {
    return false;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey.trim());
  if (!match) {
    return false;
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }
  // Confirm the date round-trips (catches things like 2026-02-30).
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

/**
 * Compare two date keys.
 * Returns -1 if a < b, 1 if a > b, 0 if equal.
 * Invalid keys are sorted to the end (treated as the largest value).
 */
export function compareDateKeys(a, b) {
  const aValid = isValidDateKey(a);
  const bValid = isValidDateKey(b);
  if (!aValid && !bValid) {
    return 0;
  }
  if (!aValid) {
    return 1;
  }
  if (!bValid) {
    return -1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

/**
 * Format a date key for display, e.g. "2026-06-18" -> "18 Jun 2026".
 * Returns a safe fallback for invalid keys.
 */
export function formatDisplayDate(dateKey) {
  if (!isValidDateKey(dateKey)) {
    return "—";
  }
  const [year, month, day] = dateKey.split("-");
  const monthName = MONTHS_SHORT[parseInt(month, 10) - 1];
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

/**
 * Current timestamp as an ISO string.
 */
export function getNowIso() {
  return new Date().toISOString();
}
