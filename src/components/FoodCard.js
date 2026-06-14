// src/components/FoodCard.js
// Card showing a single food item with status and quick actions.

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../theme/colors";
import StatusBadge from "./StatusBadge";
import { formatDisplayDate } from "../utils/dateUtils";

const CATEGORY_EMOJI = {
  Fridge: "🧊",
  Freezer: "❄️",
  Pantry: "🧺",
  Spices: "🧂",
  Drinks: "🥛",
  Other: "📦",
};

export default function FoodCard({ item, status, onPress, onBuyAgain, onDelete }) {
  if (!item) {
    return null;
  }
  const emoji = CATEGORY_EMOJI[item.category] || "📦";
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name} numberOfLines={1}>
          {emoji} {item.name || "Unnamed item"}
        </Text>
        <StatusBadge status={status} />
      </View>

      <Text style={styles.category}>{item.category || "Other"}</Text>

      <View style={styles.datesRow}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Purchased</Text>
          <Text style={styles.dateValue}>{formatDisplayDate(item.purchaseDate)}</Text>
        </View>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>Expires</Text>
          <Text style={styles.dateValue}>{formatDisplayDate(item.expirationDate)}</Text>
        </View>
      </View>

      {item.quantityNote ? (
        <Text style={styles.meta}>Qty: {item.quantityNote}</Text>
      ) : null}

      {item.note ? (
        <Text style={styles.note} numberOfLines={2}>
          📝 {item.note}
        </Text>
      ) : null}

      <View style={styles.actions}>
        {onBuyAgain ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.buyAgainBtn]}
            onPress={onBuyAgain}
            activeOpacity={0.8}
          >
            <Text style={styles.buyAgainText}>↻ Buy Again</Text>
          </TouchableOpacity>
        ) : null}
        {onDelete ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={onDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteText}>🗑 Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginRight: 8,
  },
  category: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: "600",
    marginTop: 4,
  },
  datesRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: colors.mutedText,
  },
  dateValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    marginTop: 2,
  },
  meta: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 8,
  },
  note: {
    fontSize: 13,
    color: colors.text,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  buyAgainBtn: {
    backgroundColor: colors.lightGray,
  },
  buyAgainText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "#FBE3E3",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
});
