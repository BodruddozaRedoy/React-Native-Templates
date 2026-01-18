/**
 * AppButton.tsx
 *
 * ✅ Universal button component
 * ✅ Prevents double press
 * ✅ Built-in loading state
 * ✅ Consistent disabled behavior
 *
 * ---------------- WHY THIS EXISTS ----------------
 *
 * Every app has:
 * - Submit buttons
 * - Save buttons
 * - Continue / Next buttons
 *
 * This component ensures:
 * - No double submit
 * - Same UX everywhere
 *
 * -----------------------------------------------
 */

import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

/* ================= TYPES ================= */

type AppButtonProps = {
  title: string;                  // Button text
  onPress: () => void;             // Action handler
  loading?: boolean;               // Show spinner
  disabled?: boolean;              // Disable button
  style?: ViewStyle;               // Optional container style
  variant?: "primary" | "secondary";
};

/* ================= COMPONENT ================= */

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  variant = "primary",
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        {
          height: 52,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            variant === "primary" ? "#FACC15" : "#E5E7EB",
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="black" />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#000",
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES (IMPORTANT)
 *
 * ✅ USE AppButton FOR:
 * - Form submission
 * - Save / Update actions
 * - Navigation CTAs
 *
 * ❌ DO NOT USE FOR:
 * - Icon-only buttons
 * - Inline text actions
 *
 * -----------------------------------------------------
 *
 * 🧩 COMMON PATTERNS
 *
 * 1️⃣ SUBMIT FORM
 * <AppButton
 *   title="Save"
 *   loading={isSaving}
 *   onPress={handleSave}
 * />
 *
 * 2️⃣ DISABLED STATE
 * <AppButton
 *   title="Continue"
 *   disabled={!isValid}
 *   onPress={goNext}
 * />
 *
 * 3️⃣ SECONDARY BUTTON
 * <AppButton
 *   title="Cancel"
 *   variant="secondary"
 *   onPress={onCancel}
 * />
 *
 * =====================================================
 */
