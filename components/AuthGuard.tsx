/**
 * AuthGuard.tsx
 *
 * PURPOSE
 * -------
 * Protects screens or components based on authentication,
 * roles, and permissions.
 *
 * WHY THIS EXISTS
 * ---------------
 * - Centralizes auth checks
 * - Prevents auth logic duplication
 * - Keeps screens clean
 *
 * DESIGN
 * ------
 * - Uses `useAuth` as single source of truth
 * - Does NOT handle navigation directly
 * - Parent decides what to render on block
 */

import React, { ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import AppEmptyState from "@/components/AppEmptyState";

/* ================= TYPES ================= */

type AuthGuardProps = {
  children: ReactNode;

  /**
   * If true → user must be authenticated
   * Default: true
   */
  requireAuth?: boolean;

  /**
   * Allowed roles
   * Example: ["admin"]
   */
  roles?: string[];

  /**
   * Required permissions
   * Example: ["post.create"]
   */
  permissions?: string[];

  /**
   * Custom fallback UI
   * (optional)
   */
  fallback?: ReactNode;
};

/* ================= COMPONENT ================= */

export default function AuthGuard({
  children,
  requireAuth = true,
  roles,
  permissions,
  fallback,
}: AuthGuardProps) {
  const {
    loading,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyPermission,
  } = useAuth();

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  /* ================= AUTH CHECK ================= */

  if (requireAuth && !isAuthenticated) {
    return (
      fallback ?? (
        <AppEmptyState
          title="Authentication required"
          description="Please log in to continue."
        />
      )
    );
  }

  /* ================= ROLE CHECK ================= */

  if (roles && roles.length > 0) {
    const allowed = roles.some((r) => hasRole(r));
    if (!allowed) {
      return (
        fallback ?? (
          <AppEmptyState
            title="Access denied"
            description="You do not have permission to view this page."
          />
        )
      );
    }
  }

  /* ================= PERMISSION CHECK ================= */

  if (permissions && permissions.length > 0) {
    const allowed = hasAnyPermission(permissions);
    if (!allowed) {
      return (
        fallback ?? (
          <AppEmptyState
            title="Permission required"
            description="You are not allowed to perform this action."
          />
        )
      );
    }
  }

  /* ================= ALLOWED ================= */

  return <>{children}</>;
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES
 *
 * ✅ USE AuthGuard TO:
 * - Protect screens
 * - Protect sections of UI
 * - Enforce roles & permissions
 *
 * ❌ DO NOT:
 * - Put API logic here
 * - Navigate inside this component
 *
 * -----------------------------------------------------
 *
 * 🧩 COMMON PATTERNS
 *
 * 1️⃣ PROTECT A SCREEN
 *
 * <AuthGuard>
 *   <Dashboard />
 * </AuthGuard>
 *
 * 2️⃣ ROLE-BASED ACCESS
 *
 * <AuthGuard roles={["admin"]}>
 *   <AdminPanel />
 * </AuthGuard>
 *
 * 3️⃣ PERMISSION-BASED ACTION
 *
 * <AuthGuard permissions={["post.create"]}>
 *   <CreatePostButton />
 * </AuthGuard>
 *
 * 4️⃣ CUSTOM FALLBACK UI
 *
 * <AuthGuard fallback={<LoginPrompt />}>
 *   <PrivateContent />
 * </AuthGuard>
 *
 * =====================================================
 */
