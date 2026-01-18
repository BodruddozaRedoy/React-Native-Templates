/**
 * useKeyboardHeight.ts
 *
 * ✅ Universal keyboard height hook
 * ✅ Works on Android & iOS
 * ✅ Expo SDK 54+ safe
 *
 * ---------------- WHY THIS EXISTS ----------------
 *
 * ❌ Hardcoded keyboard offsets = bugs
 * ❌ KeyboardAvoidingView can't do everything
 *
 * This hook gives you:
 * - real keyboard height
 * - reactive updates
 *
 * -----------------------------------------------
 */

import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

/* ================= HOOK ================= */

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {
    keyboardHeight,
    keyboardVisible,
  };
}

/* =====================================================
 *
 * 🧠 USAGE GUIDELINES
 *
 * ✅ USE THIS HOOK WHEN:
 * - Animating bottom bars
 * - Positioning FABs
 * - Creating custom input layouts
 * - Working around Android keyboard issues
 *
 * ❌ DO NOT USE WHEN:
 * - KeyboardAvoidingView already solves the case
 * - You only need simple form handling
 *
 * -----------------------------------------------------
 *
 * 🧩 COMMON PATTERNS
 *
 * 1️⃣ MOVE A VIEW ABOVE KEYBOARD
 *
 * const { keyboardHeight } = useKeyboardHeight();
 *
 * <View style={{ marginBottom: keyboardHeight }}>
 *   <InputBar />
 * </View>
 *
 * 2️⃣ CONDITIONAL UI
 *
 * if (keyboardVisible) {
 *   hideBottomTabs();
 * }
 *
 * -----------------------------------------------------
 *
 * ⚠️ ANDROID NOTE (SDK 54+)
 *
 * Works best when:
 * {
 *   "expo": {
 *     "android": {
 *       "softwareKeyboardLayoutMode": "resize"
 *     }
 *   }
 * }
 *
 * =====================================================
 */
