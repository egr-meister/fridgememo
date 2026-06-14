// src/navigation/AppNavigator.js
// Bottom tab navigation with a stack wrapper for the Food tab so the
// Add/Edit screen can be pushed on top of the Food list.

import React from "react";
import { Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../theme/colors";
import HomeScreen from "../screens/HomeScreen";
import FoodListScreen from "../screens/FoodListScreen";
import AddEditFoodScreen from "../screens/AddEditFoodScreen";
import SearchScreen from "../screens/SearchScreen";
import BuyAgainScreen from "../screens/BuyAgainScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const FoodStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

const screenHeaderOptions = {
  headerStyle: { backgroundColor: colors.card },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: "700", color: colors.text },
  contentStyle: { backgroundColor: colors.background },
};

function FoodStackNavigator() {
  return (
    <FoodStack.Navigator screenOptions={screenHeaderOptions}>
      <FoodStack.Screen
        name="FoodList"
        component={FoodListScreen}
        options={{ title: "Food List" }}
      />
      <FoodStack.Screen
        name="AddEditFood"
        component={AddEditFoodScreen}
        options={({ route }) => ({
          title: route.params && route.params.itemId ? "Edit Food" : "Add Food",
        })}
      />
    </FoodStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenHeaderOptions}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "FridgeMemo" }}
      />
      <HomeStack.Screen
        name="AddEditFood"
        component={AddEditFoodScreen}
        options={({ route }) => ({
          title: route.params && route.params.itemId ? "Edit Food" : "Add Food",
        })}
      />
    </HomeStack.Navigator>
  );
}

function tabIcon(emoji) {
  return ({ focused }) => (
    <Text style={{ fontSize: focused ? 22 : 19 }}>{emoji}</Text>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedText,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 6,
            paddingTop: 6,
          },
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ tabBarLabel: "Home", tabBarIcon: tabIcon("🧺") }}
        />
        <Tab.Screen
          name="Food"
          component={FoodStackNavigator}
          options={{ tabBarLabel: "Food", tabBarIcon: tabIcon("🥦") }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ tabBarLabel: "Search", tabBarIcon: tabIcon("🔎") }}
        />
        <Tab.Screen
          name="BuyAgain"
          component={BuyAgainScreen}
          options={{ tabBarLabel: "Buy Again", tabBarIcon: tabIcon("📝") }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: "Settings", tabBarIcon: tabIcon("⚙️") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
