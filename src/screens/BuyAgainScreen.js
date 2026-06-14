// src/screens/BuyAgainScreen.js
// Manage the "Buy Again" shopping list.

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import ScreenContainer from "../components/ScreenContainer";
import {
  loadAppData,
  getDefaultData,
  createBuyAgainItem,
  updateBuyAgainItem,
  deleteBuyAgainItem,
  clearBuyAgainItems,
} from "../storage/appStorage";

export default function BuyAgainScreen() {
  const [data, setData] = useState(getDefaultData());
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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

  const items = data.buyAgainItems || [];

  const handleAdd = async () => {
    if (!name.trim()) {
      setError("Please enter an item name.");
      return;
    }
    setError("");
    const updated = await createBuyAgainItem({ name: name.trim(), category: "Other" });
    setData(updated);
    setName("");
  };

  const handleToggleBought = async (item) => {
    const updated = await updateBuyAgainItem(item.id, { isBought: !item.isBought });
    setData(updated);
  };

  const handleDelete = async (item) => {
    const updated = await deleteBuyAgainItem(item.id);
    setData(updated);
  };

  const handleClearAll = () => {
    if (items.length === 0) {
      return;
    }
    Alert.alert(
      "Clear list",
      "Remove all items from your Buy Again list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const updated = await clearBuyAgainItems();
            setData(updated);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.itemMain}
        activeOpacity={0.8}
        onPress={() => handleToggleBought(item)}
      >
        <Text style={styles.checkbox}>{item.isBought ? "✅" : "⬜"}</Text>
        <View style={styles.itemTextWrap}>
          <Text
            style={[styles.itemName, item.isBought ? styles.itemNameDone : null]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {item.category ? (
            <Text style={styles.itemCategory}>{item.category}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer title="Buy Again" subtitle="Items to pick up next time.">
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (error) {
              setError("");
            }
          }}
          placeholder="Add an item..."
          placeholderTextColor={colors.mutedText}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {items.length === 0 ? (
        <EmptyState
          emoji="📝"
          title="Nothing here yet"
          message="No items to buy again."
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
          <AppButton
            title="Clear All Items"
            variant="danger"
            onPress={handleClearAll}
            style={styles.clearAll}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
  addBtn: {
    marginLeft: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 6,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  itemMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    fontSize: 20,
    marginRight: 12,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  itemNameDone: {
    textDecorationLine: "line-through",
    color: colors.mutedText,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 18,
  },
  clearAll: {
    marginTop: 4,
    marginBottom: 8,
  },
});
