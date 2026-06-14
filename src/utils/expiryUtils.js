// src/utils/expiryUtils.js
// Expiration status logic. All functions handle invalid input safely.

import { isValidDateKey, getLocalDateKey } from "./dateUtils";

export const STATUS = {
  FRESH: "Fresh",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
  UNKNOWN: "Unknown",
};

function toMidnight(dateKey) {
  // dateKey is assumed valid YYYY-MM-DD.
  const [y, m, d] = dateKey.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Whole number of days from todayDate until expirationDate.
 * Positive = future, 0 = today, negative = past.
 * Returns null for invalid dates (never NaN).
 */
export function getDaysUntilExpiration(expirationDate, todayDate) {
  if (!isValidDateKey(expirationDate)) {
    return null;
  }
  const todayKey = isValidDateKey(todayDate) ? todayDate : getLocalDateKey(new Date());
  if (!isValidDateKey(todayKey)) {
    return null;
  }
  const exp = toMidnight(expirationDate);
  const today = toMidnight(todayKey);
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((exp.getTime() - today.getTime()) / msPerDay);
  if (isNaN(diff)) {
    return null;
  }
  return diff;
}

/**
 * Compute the status label for a food item.
 * - Expired: expiration date is before today.
 * - Expiring Soon: expiration is today or within the expiringSoonDays window.
 * - Fresh: expiration is later than the window.
 * - Unknown: invalid expiration date.
 */
export function getFoodStatus(item, expiringSoonDays, todayDate) {
  const expirationDate = item && item.expirationDate ? item.expirationDate : null;
  const days = getDaysUntilExpiration(expirationDate, todayDate);
  if (days === null) {
    return STATUS.UNKNOWN;
  }
  const window = Number.isFinite(expiringSoonDays) ? expiringSoonDays : 3;
  if (days < 0) {
    return STATUS.EXPIRED;
  }
  if (days <= window) {
    return STATUS.EXPIRING_SOON;
  }
  return STATUS.FRESH;
}

/**
 * True when an item is in the "Expiring Soon" window (and not expired).
 */
export function isExpiringSoon(item, expiringSoonDays, todayDate) {
  return getFoodStatus(item, expiringSoonDays, todayDate) === STATUS.EXPIRING_SOON;
}

/**
 * True when an item is past its expiration date.
 */
export function isExpired(item, todayDate) {
  const expirationDate = item && item.expirationDate ? item.expirationDate : null;
  const days = getDaysUntilExpiration(expirationDate, todayDate);
  if (days === null) {
    return false;
  }
  return days < 0;
}
