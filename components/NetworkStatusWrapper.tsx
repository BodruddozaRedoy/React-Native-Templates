/**
 * NetworkStatusWrapper.tsx
 *
 * ✅ Universal network connectivity handler
 * ✅ Detects offline / online state
 * ✅ Shows subtle offline banner
 * ✅ Optional online toast
 *
 * ---------------- WHY THIS EXISTS ----------------
 *
 * Users blame your app when:
 * - Internet is off
 * - API fails
 *
 * This component makes connectivity explicit and graceful.
 *
 * -----------------------------------------------
 */

import React, { ReactNode, useEffect, useState } from "react";
import { Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { AppToast } from "./AppToast";

/* ================= TYPES ================= */

type NetworkStatusWrapperProps = {
  children: ReactNode;
  showOnlineToast?: boolean;    // toast when connection is restored
};

/* ================= COMPONENT ================= */

export default function NetworkStatusWrapper({
  children,
  showOnlineToast = true,
}: NetworkStatusWrapperProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = Boolean(state.isConnected && state.isInternetReachable);

      if (!online) {
        setIsOnline(false);
        setWasOffline(true);
      } else {
        setIsOnline(true);

        if (wasOffline && showOnlineToast) {
          AppToast.success({
            title: "Back online",
            description: "Internet connection restored.",
          });
          setWasOffline(false);
        }
      }
    });

    return () => unsubscribe();
  }, [wasOffline, showOnlineToast]);

  return (
    <View style={{ flex: 1 }}>
      {/* OFFLINE BANNER */}
      {!isOnline && (
        <View
          style={{
            backgroundColor: "#FEF3C7",
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#92400E",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            You are offline. Some features may not work.
          </Text>
        </View>
      )}

      {/* APP CONTENT */}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES (IMPORTANT)
 *
 * ✅ USE NetworkStatusWrapper:
 * - Once near app root
 * - Or per major screen
 *
 * ❌ DO NOT:
 * - Wrap every small component
 * - Fire API calls blindly when offline
 *
 * -----------------------------------------------------
 *
 * 🧩 COMMON PATTERNS
 *
 * 1️⃣ WRAP WHOLE APP
 *
 * <NetworkStatusWrapper>
 *   <AppNavigation />
 * </NetworkStatusWrapper>
 *
 * 2️⃣ DISABLE ACTIONS WHEN OFFLINE
 *
 * if (!isOnline) {
 *   AppToast.error({ title: "No internet connection" });
 *   return;
 * }
 *
 * -----------------------------------------------------
 *
 * 🎨 CUSTOMIZATION
 *
 * - Change banner color
 * - Remove banner, keep toast only
 * - Add retry button later
 *
 * =====================================================
 */
