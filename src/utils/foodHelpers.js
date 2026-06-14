// src/utils/foodHelpers.js
// Pure helpers for working with food item collections.

import { compareDateKeys, getLocalDateKey } from "./dateUtils";
import { getFoodStatus, isExpiringSoon, isExpired, STATUS } from "./expiryUtils";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Total number of food items.
 */
export function getTotalFoodItems(foodItems) {
  return asArray(foodItems).length;
}

/**
 * Filter items by storage category. Returns all items for category "All".
 */
export function getItemsByCategory(foodItems, category) {
  const items = asArray(foodItems);
  if (!category || category === "All") {
    return items;
  }
  return items.filter((item) => item && item.category === category);
}

/**
 * Case-insensitive partial search by food name.
 * Empty query returns an empty array.
 */
export function searchFoodItems(foodItems, query) {
  const items = asArray(foodItems);
  const q = typeof query === "string" ? query.trim().toLowerCase() : "";
  if (q.length === 0) {
    return [];
  }
  return items.filter((item) => {
    const name = item && typeof item.name === "string" ? item.name.toLowerCase() : "";
    return name.indexOf(q) !== -1;
  });
}

/**
 * Sort items so the nearest expiration dates come first.
 * Items with invalid dates are placed at the end. Does not mutate input.
 */
export function sortFoodByExpiration(foodItems) {
  const items = asArray(foodItems).slice();
  items.sort((a, b) => {
    const aDate = a && a.expirationDate ? a.expirationDate : "";
    const bDate = b && b.expirationDate ? b.expirationDate : "";
    return compareDateKeys(aDate, bDate);
  });
  return items;
}

/**
 * Compute dashboard statistics from the full app data object.
 * Always returns numbers, never NaN.
 */
export function getDashboardStats(data) {
  const safe = data && typeof data === "object" ? data : {};
  const foodItems = asArray(safe.foodItems);
  const buyAgainItems = asArray(safe.buyAgainItems);
  const settings = safe.settings && typeof safe.settings === "object" ? safe.settings : {};
  const expiringSoonDays = Number.isFinite(settings.expiringSoonDays)
    ? settings.expiringSoonDays
    : 3;
  const todayKey = getLocalDateKey(new Date());

  let expiringSoon = 0;
  let expired = 0;
  for (const item of foodItems) {
    if (isExpired(item, todayKey)) {
      expired += 1;
    } else if (isExpiringSoon(item, expiringSoonDays, todayKey)) {
      expiringSoon += 1;
    }
  }

  return {
    total: foodItems.length,
    expiringSoon,
    expired,
    buyAgain: buyAgainItems.length,
  };
}

/**
 * Convenience: status label for an item using the current settings/today.
 */
export function getItemStatus(item, expiringSoonDays) {
  const window = Number.isFinite(expiringSoonDays) ? expiringSoonDays : 3;
  return getFoodStatus(item, window, getLocalDateKey(new Date()));
}

export { STATUS };
