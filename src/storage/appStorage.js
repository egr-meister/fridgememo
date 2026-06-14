// src/storage/appStorage.js
// Local persistence using AsyncStorage. All functions are defensive:
// they never throw to the caller and always fall back to default data.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNowIso } from "../utils/dateUtils";

const STORAGE_KEY = "@fridgememo/appData/v1";

export const DEFAULT_SETTINGS = {
  expiringSoonDays: 3,
  remindersEnabled: false,
  reminderTime: "09:00",
  theme: "light",
};

export function getDefaultData() {
  return {
    foodItems: [],
    buyAgainItems: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

/**
 * Generate a stable unique id: prefix + timestamp + random string.
 */
export function generateId(prefix) {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix || "id"}_${time}${rand}`;
}

function normalizeData(raw) {
  const base = getDefaultData();
  if (!raw || typeof raw !== "object") {
    return base;
  }
  return {
    foodItems: Array.isArray(raw.foodItems) ? raw.foodItems : [],
    buyAgainItems: Array.isArray(raw.buyAgainItems) ? raw.buyAgainItems : [],
    settings: {
      ...DEFAULT_SETTINGS,
      ...(raw.settings && typeof raw.settings === "object" ? raw.settings : {}),
    },
  };
}

/**
 * Load full app data. Always resolves with valid data, even on error.
 */
export async function loadAppData() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
      return getDefaultData();
    }
    const parsed = JSON.parse(json);
    return normalizeData(parsed);
  } catch (error) {
    return getDefaultData();
  }
}

/**
 * Save full app data. Returns the normalized data that was saved,
 * or the input on failure (never throws).
 */
export async function saveAppData(data) {
  const normalized = normalizeData(data);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    // Swallow errors so the UI never crashes on a failed write.
  }
  return normalized;
}

// ---------- Food items ----------

/**
 * Create a new food item and persist it. Returns the updated data.
 */
export async function createFoodItem(item) {
  const data = await loadAppData();
  const now = getNowIso();
  const newItem = {
    id: generateId("food"),
    name: item && item.name ? String(item.name) : "",
    category: item && item.category ? String(item.category) : "Other",
    purchaseDate: item && item.purchaseDate ? String(item.purchaseDate) : "",
    expirationDate: item && item.expirationDate ? String(item.expirationDate) : "",
    quantityNote: item && item.quantityNote ? String(item.quantityNote) : "",
    note: item && item.note ? String(item.note) : "",
    createdAt: now,
    updatedAt: now,
  };
  data.foodItems = [newItem, ...data.foodItems];
  return saveAppData(data);
}

/**
 * Update an existing food item by id. Returns the updated data.
 */
export async function updateFoodItem(itemId, updates) {
  const data = await loadAppData();
  const now = getNowIso();
  data.foodItems = data.foodItems.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return {
      ...item,
      ...(updates && typeof updates === "object" ? updates : {}),
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: now,
    };
  });
  return saveAppData(data);
}

/**
 * Delete a food item by id. Returns the updated data.
 */
export async function deleteFoodItem(itemId) {
  const data = await loadAppData();
  data.foodItems = data.foodItems.filter((item) => item.id !== itemId);
  return saveAppData(data);
}

// ---------- Buy Again ----------

/**
 * Move a food item into the Buy Again list (does not delete the food item).
 * Returns the updated data.
 */
export async function moveFoodToBuyAgain(itemId) {
  const data = await loadAppData();
  const food = data.foodItems.find((item) => item.id === itemId);
  if (!food) {
    return data;
  }
  const exists = data.buyAgainItems.some(
    (b) => b.name && food.name && b.name.toLowerCase() === food.name.toLowerCase() && !b.isBought
  );
  if (exists) {
    return data;
  }
  const now = getNowIso();
  const buyItem = {
    id: generateId("buy"),
    name: food.name,
    category: food.category,
    createdAt: now,
    isBought: false,
  };
  data.buyAgainItems = [buyItem, ...data.buyAgainItems];
  return saveAppData(data);
}

/**
 * Create a manual Buy Again item. Returns the updated data.
 */
export async function createBuyAgainItem(item) {
  const data = await loadAppData();
  const now = getNowIso();
  const buyItem = {
    id: generateId("buy"),
    name: item && item.name ? String(item.name) : "",
    category: item && item.category ? String(item.category) : "Other",
    createdAt: now,
    isBought: false,
  };
  data.buyAgainItems = [buyItem, ...data.buyAgainItems];
  return saveAppData(data);
}

/**
 * Update a Buy Again item (e.g. toggle isBought). Returns the updated data.
 */
export async function updateBuyAgainItem(itemId, updates) {
  const data = await loadAppData();
  data.buyAgainItems = data.buyAgainItems.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return {
      ...item,
      ...(updates && typeof updates === "object" ? updates : {}),
      id: item.id,
      createdAt: item.createdAt,
    };
  });
  return saveAppData(data);
}

/**
 * Delete a Buy Again item by id. Returns the updated data.
 */
export async function deleteBuyAgainItem(itemId) {
  const data = await loadAppData();
  data.buyAgainItems = data.buyAgainItems.filter((item) => item.id !== itemId);
  return saveAppData(data);
}

/**
 * Remove all Buy Again items. Returns the updated data.
 */
export async function clearBuyAgainItems() {
  const data = await loadAppData();
  data.buyAgainItems = [];
  return saveAppData(data);
}

// ---------- Settings ----------

/**
 * Merge new settings values. Returns the updated data.
 */
export async function updateSettings(settings) {
  const data = await loadAppData();
  data.settings = {
    ...data.settings,
    ...(settings && typeof settings === "object" ? settings : {}),
  };
  return saveAppData(data);
}

// ---------- Reset ----------

/**
 * Clear all data and restore defaults. Returns the default data.
 */
export async function clearAllData() {
  const fresh = getDefaultData();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch (error) {
    // ignore
  }
  return fresh;
}
