/**
 * AppToast.tsx
 *
 * ✅ Shadcn-inspired toast UI for React Native
 * ✅ Centralized toast API
 * ✅ Easily themeable
 * ✅ Replaceable later without touching app code
 *
 * ---------------- WHY THIS EXISTS ----------------
 *
 * ❌ Directly calling toast library everywhere = tech debt
 * ✅ One wrapper = full control over design & behavior
 *
 * -----------------------------------------------
 */

import React from "react";
import { View, Text } from "react-native";
import Toast, {
  BaseToast,
  ToastConfig,
} from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

/* =====================================================
 *  TOAST STYLES (EDIT THIS LATER IF YOU WANT)
 * ===================================================== */

const toastBaseStyle = {
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 16,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const titleStyle = {
  fontSize: 15,
  fontWeight: "700" as const,
  color: "#111827",
};

const descStyle = {
  marginTop: 2,
  fontSize: 13,
  color: "#6B7280",
};

/* =====================================================
 *  TOAST CONFIG (UI DEFINITIONS)
 * ===================================================== */

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={[
        toastBaseStyle,
        {
          backgroundColor: "#ECFDF5",
          borderWidth: 1,
          borderColor: "#A7F3D0",
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Ionicons name="checkmark-circle" size={22} color="#10B981" />
        <View style={{ flex: 1 }}>
          <Text style={titleStyle}>{text1}</Text>
          {text2 && <Text style={descStyle}>{text2}</Text>}
        </View>
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={[
        toastBaseStyle,
        {
          backgroundColor: "#FEF2F2",
          borderWidth: 1,
          borderColor: "#FCA5A5",
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Ionicons name="close-circle" size={22} color="#EF4444" />
        <View style={{ flex: 1 }}>
          <Text style={titleStyle}>{text1}</Text>
          {text2 && <Text style={descStyle}>{text2}</Text>}
        </View>
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View
      style={[
        toastBaseStyle,
        {
          backgroundColor: "#EFF6FF",
          borderWidth: 1,
          borderColor: "#93C5FD",
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Ionicons name="information-circle" size={22} color="#3B82F6" />
        <View style={{ flex: 1 }}>
          <Text style={titleStyle}>{text1}</Text>
          {text2 && <Text style={descStyle}>{text2}</Text>}
        </View>
      </View>
    </View>
  ),
};

/* =====================================================
 *  TOAST API (THIS IS WHAT YOU USE IN APP)
 * ===================================================== */

type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
};

export const AppToast = {
  success({ title, description, duration = 3000 }: ToastOptions) {
    Toast.show({
      type: "success",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },

  error({ title, description, duration = 3500 }: ToastOptions) {
    Toast.show({
      type: "error",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },

  info({ title, description, duration = 3000 }: ToastOptions) {
    Toast.show({
      type: "info",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },
};

/* =====================================================
 *  ROOT COMPONENT (MOUNT ONCE)
 * ===================================================== */

export function AppToastRoot() {
  return <Toast config={toastConfig} />;
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES
 *
 * 1️⃣ Mount <AppToastRoot /> ONCE (usually in App.tsx)
 *
 * 2️⃣ Use AppToast everywhere instead of Toast.show()
 *
 * -----------------------------------------------------
 *
 * 🧩 EXAMPLES
 *
 * AppToast.success({
 *   title: "Post created",
 *   description: "Your post is now live."
 * });
 *
 * AppToast.error({
 *   title: "Something went wrong",
 *   description: "Please try again."
 * });
 *
 * AppToast.info({
 *   title: "Saved",
 * });
 *
 * -----------------------------------------------------
 *
 * 🎨 CUSTOMIZATION
 *
 * - Change colors in toastConfig
 * - Add icons / animations
 * - Add new variants (warning, loading, etc.)
 *
 * =====================================================
 */
