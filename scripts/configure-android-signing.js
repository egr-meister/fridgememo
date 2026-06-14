#!/usr/bin/env node
/*
 * configure-android-signing.js
 *
 * Patches the Expo-generated android/app/build.gradle so the *release* build
 * type is signed with a real keystore instead of the debug keystore.
 *
 * It expects an android/key.properties file (created by the CI workflow) with:
 *   storeFile=release.keystore
 *   storePassword=...
 *   keyAlias=...
 *   keyPassword=...
 *
 * This script is idempotent: running it twice has no extra effect.
 */

const fs = require("fs");
const path = require("path");

const gradlePath = path.join(__dirname, "..", "android", "app", "build.gradle");

if (!fs.existsSync(gradlePath)) {
  console.error("[signing] android/app/build.gradle not found. Run expo prebuild first.");
  process.exit(1);
}

let gradle = fs.readFileSync(gradlePath, "utf8");

if (gradle.includes("signingConfigs.release")) {
  console.log("[signing] Release signing config already present. Skipping.");
  process.exit(0);
}

// Load key.properties at the very top of the file (after the first line).
const loaderBlock = [
  "def keystorePropertiesFile = rootProject.file(\"key.properties\")",
  "def keystoreProperties = new Properties()",
  "if (keystorePropertiesFile.exists()) {",
  "    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))",
  "}",
  "",
].join("\n");

gradle = loaderBlock + gradle;

// Add a release signingConfig next to the existing debug one.
const releaseSigningBlock = [
  "        release {",
  "            if (keystoreProperties[\"storeFile\"]) {",
  "                storeFile file(keystoreProperties[\"storeFile\"])",
  "                storePassword keystoreProperties[\"storePassword\"]",
  "                keyAlias keystoreProperties[\"keyAlias\"]",
  "                keyPassword keystoreProperties[\"keyPassword\"]",
  "            }",
  "        }",
].join("\n");

// Insert the release block right after the "signingConfigs {" opening line.
gradle = gradle.replace(
  /signingConfigs\s*\{/,
  (match) => `${match}\n${releaseSigningBlock}`
);

// Point the release build type at the release signing config.
// The Expo template uses `signingConfig signingConfigs.debug` under release.
gradle = gradle.replace(
  /(release\s*\{[^}]*?)signingConfig\s+signingConfigs\.debug/s,
  "$1signingConfig keystoreProperties[\"storeFile\"] ? signingConfigs.release : signingConfigs.debug"
);

fs.writeFileSync(gradlePath, gradle, "utf8");
console.log("[signing] Patched android/app/build.gradle with release signing config.");
