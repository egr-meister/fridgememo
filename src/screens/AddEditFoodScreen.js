// src/screens/AddEditFoodScreen.js
// Create or edit a food item with validation.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import CategoryChip from "../components/CategoryChip";
import DateInput from "../components/DateInput";
import {
  loadAppData,
  createFoodItem,
  updateFoodItem,
} from "../storage/appStorage";
import {
  isValidDateKey,
  compareDateKeys,
  getLocalDateKey,
} from "../utils/dateUtils";

const CATEGORIES = ["Fridge", "Freezer", "Pantry", "Spices", "Drinks", "Other"];

export default function AddEditFoodScreen({ navigation, route }) {
  const itemId = route.params ? route.params.itemId : null;
  const isEditing = !!itemId;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(getLocalDateKey(new Date()));
  const [expirationDate, setExpirationDate] = useState("");
  const [quantityNote, setQuantityNote] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    if (isEditing) {
      loadAppData().then((data) => {
        if (!active) {
          return;
        }
        const existing = data.foodItems.find((i) => i.id === itemId);
        if (existing) {
          setName(existing.name || "");
          setCategory(existing.category || "");
          setPurchaseDate(existing.purchaseDate || "");
          setExpirationDate(existing.expirationDate || "");
          setQuantityNote(existing.quantityNote || "");
          setNote(existing.note || "");
        }
      });
    }
    return () => {
      active = false;
    };
  }, [isEditing, itemId]);

  const validate = () => {
    const next = {};
    if (!name.trim()) {
      next.name = "Please enter a food name.";
    }
    if (!category) {
      next.category = "Please select a category.";
    }
    if (!isValidDateKey(purchaseDate)) {
      next.purchaseDate = "Please enter a valid purchase date.";
    }
    if (!isValidDateKey(expirationDate)) {
      next.expirationDate = "Please enter a valid expiration date.";
    }
    if (
      isValidDateKey(purchaseDate) &&
      isValidDateKey(expirationDate) &&
      compareDateKeys(expirationDate, purchaseDate) < 0
    ) {
      next.expirationDate = "Expiration date cannot be before purchase date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const payload = {
      name: name.trim(),
      category,
      purchaseDate,
      expirationDate,
      quantityNote: quantityNote.trim(),
      note: note.trim(),
    };
    if (isEditing) {
      await updateFoodItem(itemId, payload);
    } else {
      await createFoodItem(payload);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Food name</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Milk"
          placeholderTextColor={colors.mutedText}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              selected={category === c}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

        <DateInput
          label="Purchase date"
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          error={errors.purchaseDate}
        />

        <DateInput
          label="Expiration date"
          value={expirationDate}
          onChangeText={setExpirationDate}
          error={errors.expirationDate}
        />

        <Text style={styles.label}>Quantity note</Text>
        <TextInput
          style={styles.input}
          value={quantityNote}
          onChangeText={setQuantityNote}
          placeholder="e.g. 1 bottle"
          placeholderTextColor={colors.mutedText}
        />

        <Text style={styles.label}>Optional note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Opened"
          placeholderTextColor={colors.mutedText}
          multiline
        />

        <AppButton
          title={isEditing ? "💾 Save Changes" : "➕ Add Food"}
          onPress={handleSave}
          style={styles.saveBtn}
        />
        <AppButton
          title="Cancel"
          variant="light"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  saveBtn: {
    marginTop: 18,
    marginBottom: 10,
  },
});
