// src/screens/SearchScreen.js
// Search food items by name (case-insensitive, partial match).

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ScreenContainer from "../components/ScreenContainer";
import { loadAppData, getDefaultData } from "../storage/appStorage";
import { searchFoodItems } from "../utils/foodHelpers";
import { getFoodStatus } from "../utils/expiryUtils";
import { formatDisplayDate, getLocalDateKey } from "../utils/dateUtils";

export default function SearchScreen() {
  const [data, setData] = useState(getDefaultData());
  const [query, setQuery] = useState("");

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
  const trimmed = query.trim();
  const results = searchFoodItems(data.foodItems, trimmed);

  const renderResult = ({ item }) => (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultName} numberOfLines={1}>
          {item.name}
        </Text>
        <StatusBadge status={getFoodStatus(item, expiringSoonDays, todayKey)} />
      </View>
      <Text style={styles.resultMeta}>{item.category}</Text>
      <Text style={styles.resultMeta}>
        Expires: {formatDisplayDate(item.expirationDate)}
      </Text>
    </View>
  );

  let body;
  if (trimmed.length === 0) {
    body = (
      <EmptyState
        emoji="🔎"
        title="Search food"
        message="Type a food name to search."
      />
    );
  } else if (results.length === 0) {
    body = (
      <EmptyState
        emoji="🤔"
        title="No results"
        message="No matching food found."
      />
    );
  } else {
    body = (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <ScreenContainer title="Search" subtitle="Find food by name.">
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search food name..."
          placeholderTextColor={colors.mutedText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setQuery("")}
            activeOpacity={0.8}
          >
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {body}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  clearBtn: {
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  clearText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 24,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginRight: 8,
  },
  resultMeta: {
    fontSize: 13,
    color: colors.mutedText,
    marginTop: 4,
  },
});
