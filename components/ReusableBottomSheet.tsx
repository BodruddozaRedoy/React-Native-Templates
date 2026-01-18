/**
 * ReusableBottomSheet.tsx
 *
 * ✅ Drop-in BottomSheetModal wrapper
 * ✅ Safe for Expo SDK 54+
 * ✅ Correct keyboard handling (Android + iOS)
 *
 * ---------------- HOW TO USE ----------------
 *
 * 1. Parent must control `visible` state
 * 2. Pass any JSX as `children`
 * 3. For TextInput inside this sheet:
 *    ➜ ALWAYS call `sheetRef.current?.expand()` on focus
 *
 * --------------------------------------------
 */

import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

/* ================= TYPES ================= */

type ReusableBottomSheetProps = {
  visible: boolean;              // control open / close
  onClose: () => void;            // called when sheet closes
  children: ReactNode;            // your custom UI
  snapPoints?: string[];          // optional custom snap points
};

/* ================= COMPONENT ================= */

export default function ReusableBottomSheet({
  visible,
  onClose,
  children,
  snapPoints,
}: ReusableBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  /* ================= SNAP POINTS ================= */

  const finalSnapPoints = useMemo(
    () => snapPoints || ["85%"],
    [snapPoints]
  );

  /* ================= OPEN / CLOSE ================= */

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  /* ================= BACKDROP ================= */

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  );

  /* ================= RENDER ================= */

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={finalSnapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: "#E5E7EB" }}
    >
      <BottomSheetView
        style={{
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/**
         * 👇 YOUR CONTENT GOES HERE
         * Can include TextInput, buttons, lists, etc.
         */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          {children}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

/* =========================================================
 *
 * ⚠️ TEXT INPUT GUIDELINES (VERY IMPORTANT)
 *
 * When using TextInput INSIDE this sheet:
 *
 * 1️⃣ ALWAYS expand sheet on focus
 *
 * <TextInput
 *   onFocus={() => sheetRef.current?.expand()}
 * />
 *
 * 2️⃣ DO NOT wrap with KeyboardAvoidingView
 * 3️⃣ DO NOT use Modal with this component
 *
 * =========================================================
 */
