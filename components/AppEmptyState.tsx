/**
 * AppEmptyState.tsx
 *
 * ✅ Universal empty / error / no-data component
 * ✅ Reusable across all screens
 * ✅ Minimal but flexible
 *
 * ---------------- WHY THIS EXISTS ----------------
 *
 * Every app needs:
 * - "No data found"
 * - "Something went wrong"
 * - "Start by creating your first item"
 *
 * This component prevents duplicating UI logic everywhere.
 *
 * -----------------------------------------------
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

/* ================= TYPES ================= */

type AppEmptyStateProps = {
  title: string;                 // Main message (required)
  description?: string;          // Optional explanation
  actionText?: string;           // Button label
  onActionPress?: () => void;     // Button action
};

/* ================= COMPONENT ================= */

export default function AppEmptyState({
  title,
  description,
  actionText,
  onActionPress,
}: AppEmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#111827",
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {/* DESCRIPTION */}
      {description && (
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      )}

      {/* ACTION BUTTON */}
      {actionText && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.8}
          style={{
            marginTop: 20,
            backgroundColor: "#FACC15",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000",
            }}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES (READ THIS)
 *
 * ✅ USE AppEmptyState WHEN:
 * - API returns empty array
 * - Search has no results
 * - User has no content yet
 * - Error screen fallback
 *
 * ❌ DO NOT USE WHEN:
 * - Data is loading (use skeleton / loader)
 * - Temporary background state
 *
 * -----------------------------------------------------
 *
 * 🧩 COMMON PATTERNS
 *
 * 1️⃣ NO DATA
 * <AppEmptyState
 *   title="No posts yet"
 *   description="Be the first to share something."
 *   actionText="Create Post"
 *   onActionPress={openCreatePost}
 * />
 *
 * 2️⃣ SEARCH EMPTY
 * <AppEmptyState
 *   title="No results found"
 *   description="Try searching with a different keyword."
 * />
 *
 * 3️⃣ ERROR STATE
 * <AppEmptyState
 *   title="Something went wrong"
 *   description="Please try again later."
 *   actionText="Retry"
 *   onActionPress={refetch}
 * />
 *
 * =====================================================
 */
