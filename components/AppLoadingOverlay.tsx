/**
 * AppLoadingOverlay.tsx
 *
 * ✅ Universal full-screen loading blocker
 * ✅ Prevents multiple taps
 * ✅ Works on any screen
 * ✅ Expo SDK 54+ safe
 *
 * ---------------- HOW TO USE ----------------
 *
 * 1. Render once at screen root
 * 2. Control visibility with `visible`
 * 3. Use during API calls / mutations
 *
 * --------------------------------------------
 */

import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  View,
} from "react-native";

/* ================= TYPES ================= */

type AppLoadingOverlayProps = {
  visible: boolean;
  text?: string;
};

/* ================= COMPONENT ================= */

export default function AppLoadingOverlay({
  visible,
  text = "Please wait...",
}: AppLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 28,
            paddingVertical: 24,
            borderRadius: 16,
            alignItems: "center",
            minWidth: 160,
          }}
        >
          <ActivityIndicator size="large" />
          <Text
            style={{
              marginTop: 12,
              fontSize: 15,
              color: "#374151",
              textAlign: "center",
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

/* =====================================================
 *
 * ⚠️ IMPORTANT GUIDELINES
 *
 * ✅ USE THIS FOR:
 * - API calls
 * - Form submission
 * - Payment processing
 * - Auth / onboarding steps
 *
 * ❌ DO NOT USE THIS FOR:
 * - Long background loading
 * - Skeleton screens
 *
 * -----------------------------------------------------
 *
 * 🧠 BEST PRACTICE
 *
 * - Show for < 5 seconds
 * - Always hide on error/success
 *
 * =====================================================
 */
