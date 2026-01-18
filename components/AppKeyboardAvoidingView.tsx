/**
 * AppKeyboardAvoidingView.tsx
 *
 * ✅ Reusable KeyboardAvoidingView wrapper
 * ✅ Expo SDK 54+ safe
 * ✅ Android + iOS compatible
 *
 * ---------------- HOW TO USE ----------------
 *
 * 1. Wrap your screen content with this component
 * 2. DO NOT wrap BottomSheet / Modal with this
 * 3. Input bar should usually be INSIDE this wrapper
 *
 * --------------------------------------------
 */

import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ================= TYPES ================= */

type AppKeyboardAvoidingViewProps = {
  children: ReactNode;
  style?: ViewStyle;
  /**
   * Optional extra offset if your screen has a header
   * Example: header height = 56
   */
  extraOffset?: number;
};

/* ================= COMPONENT ================= */

export default function AppKeyboardAvoidingView({
  children,
  style,
  extraOffset = 0,
}: AppKeyboardAvoidingViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top + extraOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

/* =====================================================
 *
 * ⚠️ IMPORTANT GUIDELINES (READ BEFORE USING)
 *
 * ✅ USE THIS COMPONENT FOR:
 * - Normal screens
 * - Forms
 * - Chat pages
 * - Fixed input bars
 *
 * ❌ DO NOT USE THIS COMPONENT FOR:
 * - BottomSheetModal
 * - Gorhom BottomSheet
 * - React Native Modal
 *
 * -----------------------------------------------------
 *
 * 🧠 ANDROID (Expo SDK 54+)
 *
 * You MUST add this in app.json:
 *
 * {
 *   "expo": {
 *     "android": {
 *       "softwareKeyboardLayoutMode": "resize"
 *     }
 *   }
 * }
 *
 * -----------------------------------------------------
 *
 * 🧠 TEXT INPUT RULES
 *
 * - TextInput should be inside this wrapper
 * - Avoid nesting ScrollView inside ScrollView
 * - FlatList is allowed (NOT inside ScrollView)
 *
 * =====================================================
 */
