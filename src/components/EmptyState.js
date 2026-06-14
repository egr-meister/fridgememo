// src/components/EmptyState.js
// Friendly placeholder shown when a list has no items.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function EmptyState({ emoji = "🧺", title, message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: "center",
    lineHeight: 20,
  },
});
