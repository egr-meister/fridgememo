// src/components/StatusBadge.js
// Small colored badge that shows a food item's status.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { STATUS } from "../utils/expiryUtils";

const STATUS_STYLES = {
  [STATUS.FRESH]: { bg: "#E4F5EA", text: colors.success, emoji: "✅" },
  [STATUS.EXPIRING_SOON]: { bg: "#FBEFD8", text: colors.warning, emoji: "⚠️" },
  [STATUS.EXPIRED]: { bg: "#FBE3E3", text: colors.danger, emoji: "⛔" },
  [STATUS.UNKNOWN]: { bg: colors.lightGray, text: colors.mutedText, emoji: "❔" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES[STATUS.UNKNOWN];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>
        {config.emoji} {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
