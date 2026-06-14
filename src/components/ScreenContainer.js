// src/components/ScreenContainer.js
// Standard padded, safe-area aware container used by all screens.

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../theme/colors";

export default function ScreenContainer({ children, title, subtitle, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top > 0 ? insets.top : 12 },
        style,
      ]}
    >
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginBottom: 10,
  },
  body: {
    flex: 1,
  },
});
