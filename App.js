// App.js
// Entry point for FridgeMemo. Sets up safe area, status bar and navigation.

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import colors from "./src/theme/colors";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
