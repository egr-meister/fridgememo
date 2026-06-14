// src/components/CategoryChip.js
// Selectable pill used for category and filter selection.

import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

const CATEGORY_EMOJI = {
  Fridge: "🧊",
  Freezer: "❄️",
  Pantry: "🧺",
  Spices: "🧂",
  Drinks: "🥛",
  Other: "📦",
};

export default function CategoryChip({ label, selected, onPress, showEmoji = true }) {
  const emoji = showEmoji ? CATEGORY_EMOJI[label] : null;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
    >
      <Text
        style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}
      >
        {emoji ? emoji + " " : ""}
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
  textSelected: {
    color: colors.white,
  },
  textUnselected: {
    color: colors.text,
  },
});
