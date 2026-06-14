// src/screens/FoodListScreen.js
// Lists all food items with category/status filters and per-item actions.

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import FoodCard from "../components/FoodCard";
import CategoryChip from "../components/CategoryChip";
import EmptyState from "../components/EmptyState";
import {
  loadAppData,
  getDefaultData,
  deleteFoodItem,
  moveFoodToBuyAgain,
} from "../storage/appStorage";
import { sortFoodByExpiration } from "../utils/foodHelpers";
import { getFoodStatus, STATUS } from "../utils/expiryUtils";
import { getLocalDateKey } from "../utils/dateUtils";

const FILTERS = [
  "All",
  "Fridge",
  "Freezer",
  "Pantry",
  "Spices",
  "Drinks",
  "Other",
  "Expiring Soon",
  "Expired",
];

const STORAGE_CATEGORIES = ["Fridge", "Freezer", "Pantry", "Spices", "Drinks", "Other"];

export default function FoodListScreen({ navigation }) {
  const [data, setData] = useState(getDefaultData());
  const [filter, setFilter] = useState("All");

  const refresh = useCallback(() => {
    let active = true;
    loadAppData().then((loaded) => {
      if (active) {
        setData(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(refresh);

  const expiringSoonDays = data.settings ? data.settings.expiringSoonDays : 3;
  const todayKey = getLocalDateKey(new Date());

  const sorted = sortFoodByExpiration(data.foodItems);
  const filtered = sorted.filter((item) => {
    if (filter === "All") {
      return true;
    }
    if (STORAGE_CATEGORIES.indexOf(filter) !== -1) {
      return item.category === filter;
    }
    const status = getFoodStatus(item, expiringSoonDays, todayKey);
    if (filter === "Expiring Soon") {
      return status === STATUS.EXPIRING_SOON;
    }
    if (filter === "Expired") {
      return status === STATUS.EXPIRED;
    }
    return true;
  });

  const handleEdit = (item) => {
    navigation.navigate("AddEditFood", { itemId: item.id });
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete item",
      `Delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = await deleteFoodItem(item.id);
            setData(updated);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleBuyAgain = async (item) => {
    const updated = await moveFoodToBuyAgain(item.id);
    setData(updated);
    Alert.alert("Buy Again", `"${item.name}" added to your Buy Again list.`);
  };

  const renderItem = ({ item }) => (
    <FoodCard
      item={item}
      status={getFoodStatus(item, expiringSoonDays, todayKey)}
      onPress={() => handleEdit(item)}
      onBuyAgain={() => handleBuyAgain(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <CategoryChip
              key={f}
              label={f}
              selected={filter === f}
              showEmoji={STORAGE_CATEGORIES.indexOf(f) !== -1}
              onPress={() => setFilter(f)}
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("AddEditFood", { itemId: null })}
      >
        <Text style={styles.addBtnText}>➕ Add Food</Text>
      </TouchableOpacity>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🥦"
          title={data.foodItems.length === 0 ? "No food items yet." : "Nothing here"}
          message={
            data.foodItems.length === 0
              ? "Add your first item to start tracking."
              : "No items match this filter."
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    paddingTop: 10,
    paddingLeft: 12,
  },
  filterRow: {
    paddingRight: 12,
  },
  addBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  addBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
