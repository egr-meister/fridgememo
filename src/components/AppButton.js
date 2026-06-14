// src/components/AppButton.js
// Large, rounded, tappable button with variants.

import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: variantStyle.bg },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color: variantStyle.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const VARIANTS = {
  primary: { bg: colors.primary, text: colors.white },
  secondary: { bg: colors.secondary, text: colors.white },
  accent: { bg: colors.accent, text: colors.text },
  danger: { bg: colors.danger, text: colors.white },
  light: { bg: colors.lightGray, text: colors.text },
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
