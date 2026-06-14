// src/screens/HomeScreen.js
// Dashboard with summary cards and quick actions.

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import { loadAppData, getDefaultData } from "../storage/appStorage";
import { getDashboardStats } from "../utils/foodHelpers";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState(getDefaultData());

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

  const stats = getDashboardStats(data);
  const hasItems = stats.total > 0;

  const goToFood = () => navigation.navigate("Food");
  const goToSearch = () => navigation.navigate("Search");
  const goToBuyAgain = () => navigation.navigate("BuyAgain");
  const goToAdd = () =>
    navigation.navigate("AddEditFood", { itemId: null });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.appName}>FridgeMemo</Text>
      <Text style={styles.subtitle}>
        Simple notes for food dates and kitchen stock.
      </Text>

      <View style={styles.cardsGrid}>
        <DashboardCard
          label="Total Items"
          value={stats.total}
          emoji="🧺"
          color={colors.primary}
        />
        <DashboardCard
          label="Expiring Soon"
          value={stats.expiringSoon}
          emoji="⚠️"
          color={colors.warning}
        />
        <DashboardCard
          label="Expired"
          value={stats.expired}
          emoji="⛔"
          color={colors.danger}
        />
        <DashboardCard
          label="Buy Again"
          value={stats.buyAgain}
          emoji="📝"
          color={colors.secondary}
        />
      </View>

      {!hasItems ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            emoji="🥦"
            title="No food items yet"
            message="No food items yet. Add your first item to start tracking."
          />
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <AppButton title="➕ Add Food" onPress={goToAdd} style={styles.actionBtn} />
        <AppButton
          title="🥦 View Food List"
          variant="secondary"
          onPress={goToFood}
          style={styles.actionBtn}
        />
        <AppButton
          title="🔎 Search Food"
          variant="light"
          onPress={goToSearch}
          style={styles.actionBtn}
        />
        <AppButton
          title="📝 Buy Again List"
          variant="accent"
          onPress={goToBuyAgain}
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
}

function DashboardCard({ label, value, emoji, color }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 4,
    marginBottom: 18,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 6,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 2,
  },
  emptyWrap: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
    marginBottom: 12,
  },
  actions: {
    marginTop: 2,
  },
  actionBtn: {
    marginBottom: 12,
  },
});
