// src/screens/SettingsScreen.js
// Local-only settings: expiring window, reminders, privacy note, reset.

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import CategoryChip from "../components/CategoryChip";
import ScreenContainer from "../components/ScreenContainer";
import {
  loadAppData,
  getDefaultData,
  updateSettings,
  clearAllData,
  DEFAULT_SETTINGS,
} from "../storage/appStorage";

const DAY_OPTIONS = [1, 3, 5, 7];

export default function SettingsScreen() {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  const refresh = useCallback(() => {
    let active = true;
    loadAppData().then((data) => {
      if (active) {
        setSettings(data.settings || { ...DEFAULT_SETTINGS });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(refresh);

  const persist = async (partial) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    await updateSettings(partial);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all local food data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const fresh = await clearAllData();
            setSettings(fresh.settings);
            Alert.alert("Done", "All local data has been cleared.");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenContainer title="Settings" subtitle="Local preferences for this device.">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Expiring Soon Window */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expiring Soon Window</Text>
          <Text style={styles.sectionHint}>
            How many days before the expiration date an item is marked “Expiring Soon”.
          </Text>
          <View style={styles.chipRow}>
            {DAY_OPTIONS.map((d) => (
              <CategoryChip
                key={d}
                label={`${d} day${d > 1 ? "s" : ""}`}
                selected={settings.expiringSoonDays === d}
                showEmoji={false}
                onPress={() => persist({ expiringSoonDays: d })}
              />
            ))}
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reminders enabled</Text>
            <Switch
              value={!!settings.remindersEnabled}
              onValueChange={(v) => persist({ remindersEnabled: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.rowColumn}>
            <Text style={styles.rowLabel}>Reminder time</Text>
            <TextInput
              style={styles.timeInput}
              value={settings.reminderTime}
              onChangeText={(t) => setSettings((s) => ({ ...s, reminderTime: t }))}
              onEndEditing={() => persist({ reminderTime: settings.reminderTime })}
              placeholder="09:00"
              placeholderTextColor={colors.mutedText}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <Text style={styles.note}>
            Reminder settings are stored locally. Push notifications are not required in
            this version.
          </Text>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Theme</Text>
          <Text style={styles.sectionHint}>This version uses a single light theme.</Text>
          <View style={styles.chipRow}>
            <CategoryChip label="Light" selected showEmoji={false} onPress={() => {}} />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.note}>
            FridgeMemo does not collect personal data. The app works offline and stores
            food items, dates, buy-again list, and settings only on this device.
          </Text>
        </View>

        {/* Clear data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <AppButton
            title="Clear All Data"
            variant="danger"
            onPress={handleClearAll}
          />
        </View>

        <Text style={styles.version}>FridgeMemo v1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowColumn: {
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  timeInput: {
    marginTop: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    width: 120,
  },
  note: {
    fontSize: 13,
    color: colors.mutedText,
    lineHeight: 19,
    marginTop: 8,
  },
  version: {
    textAlign: "center",
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 4,
  },
});
