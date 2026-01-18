/**
 * AuthGate.tsx
 *
 * Decides which stack to show based on auth state.
 * THIS is where navigation happens.
 */

import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  // Loading → splash
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Not authenticated → go to login
  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
}
