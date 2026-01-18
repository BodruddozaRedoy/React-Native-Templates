/**
 * useAuth.ts
 *
 * PURPOSE
 * -------
 * Single source of truth for authentication.
 *
 * This hook owns:
 * - auth state (user)
 * - auth lifecycle (login → persist → hydrate)
 * - password recovery flows
 * - OTP flows
 * - account security actions
 *
 * DESIGN PRINCIPLES
 * -----------------
 * - No service files → portable across projects
 * - Axios handles transport & logging
 * - This hook handles BUSINESS logic only
 * - Errors are already normalized by api.ts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { AppToast } from "@/components/AppToast";
import { authEvents } from "@/lib/authEvents";

/* =====================================================
 * STORAGE KEYS
 * These keys define the auth persistence contract
 * ===================================================== */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

/* =====================================================
 * HELPERS
 * ===================================================== */

/**
 * Persist auth atomically.
 *
 * WHY:
 * Tokens MUST be saved before updating React state so that:
 * - axios interceptors always have access to token
 * - app reload does not cause "ghost logout"
 */
async function saveAuth(data: { access: string; refresh?: string; user: any }) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.access);

  if (data.refresh) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  }

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

/**
 * Clears all auth-related storage.
 *
 * WHY:
 * Auth cleanup must be destructive to avoid:
 * - token leakage
 * - cross-user cache pollution
 */
async function clearAuth() {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
  ]);
}

/**
 * Maps normalized API errors to UI toasts
 * Keeps UI clean & consistent
 */
function handleAuthError(error: any) {
  if (!error) return;

  AppToast.error({
    title: "Authentication Error",
    description: error.message,
  });
}

/* =====================================================
 * AUTH HOOK
 * ===================================================== */

export function useAuth() {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * ROLE & PERMISSION HELPERS
   *
   * Expected user shape:
   * {
   *   role: "admin" | "user"
   *   permissions?: string[]
   * }
   */

  const role = user?.role ?? null;
  const permissions: string[] = user?.permissions ?? [];

  const hasRole = (r: string) => role === r;

  const hasPermission = (perm: string) => permissions.includes(perm);

  const hasAnyPermission = (perms: string[]) =>
    perms.some((p) => permissions.includes(p));

  /* =====================================================
   * BOOTSTRAP AUTH ON APP START
   *
   * WHY:
   * Prevents "flash logout" UX while AsyncStorage loads.
   * ===================================================== */

  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = authEvents.subscribe(async () => {
      await clearAuth();
      setUser(null);
      queryClient.clear();
    });

    return unsubscribe;
  }, []);

  /* =====================================================
   * CORE AUTH FLOW
   *
   * Backend contract:
   * - login/register must return:
   *   { access, refresh?, user }
   * ===================================================== */

  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      (await api.post("/auth/login/", payload)).data,

    onSuccess: async (data) => {
      await saveAuth(data);
      setUser(data.user);

      /**
       * Clearing cache ensures:
       * - no stale user-scoped data
       * - no data leakage between users
       */
      queryClient.clear();
    },

    onError: handleAuthError,
  });

  const register = useMutation({
    mutationFn: async (payload: any) =>
      (await api.post("/auth/register/", payload)).data,

    onSuccess: async (data) => {
      await saveAuth(data);
      setUser(data.user);
      queryClient.clear();
    },
    onError: handleAuthError,
  });

  /* =====================================================
   * LOGOUT
   *
   * WHY:
   * Logout is client-driven.
   * Backend logout is optional and app-specific.
   * ===================================================== */

  const logout = async () => {
    await clearAuth();
    setUser(null);
    queryClient.clear();
  };

  /* =====================================================
   * PASSWORD RECOVERY FLOW
   *
   * SEQUENCE:
   * forgotPassword → verifyResetOtp → resetPassword
   *
   * Backend responsibility:
   * - OTP expiry
   * - rate limiting
   * ===================================================== */

  const forgotPassword = useMutation({
    mutationFn: async (payload: { email: string }) =>
      (await api.post("/auth/forgot-password/", payload)).data,
    onError: handleAuthError,
  });

  const verifyResetOtp = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) =>
      (await api.post("/auth/verify-reset-otp/", payload)).data,
    onError: handleAuthError,
  });

  const resetPassword = useMutation({
    mutationFn: async (payload: {
      email: string;
      otp: string;
      new_password: string;
    }) => (await api.post("/auth/reset-password/", payload)).data,
    onError: handleAuthError,
  });

  /* =====================================================
   * GENERIC OTP FLOWS (EMAIL / PHONE)
   *
   * Used for:
   * - signup verification
   * - sensitive actions
   * ===================================================== */

  const sendOtp = useMutation({
    mutationFn: async (payload: {
      target: string; // email or phone
      type: "email" | "phone";
    }) => (await api.post("/auth/send-otp/", payload)).data,
    onError: handleAuthError,
  });

  const verifyOtp = useMutation({
    mutationFn: async (payload: { target: string; otp: string }) =>
      (await api.post("/auth/verify-otp/", payload)).data,
    onError: handleAuthError,
  });

  const resendOtp = useMutation({
    mutationFn: async (payload: { target: string }) =>
      (await api.post("/auth/resend-otp/", payload)).data,
    onError: handleAuthError,
  });

  /* =====================================================
   * ACCOUNT SECURITY (AUTHENTICATED)
   * ===================================================== */

  const changePassword = useMutation({
    mutationFn: async (payload: {
      old_password: string;
      new_password: string;
    }) => (await api.post("/auth/change-password/", payload)).data,
    onError: handleAuthError,
  });

  /**
   * Refresh user profile from backend.
   *
   * WHY:
   * Useful after profile updates without forcing re-login.
   */
  const refreshUser = useMutation({
    mutationFn: async () => (await api.get("/auth/me/")).data,
    onSuccess: async (data) => {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
      setUser(data);
    },
    onError: handleAuthError,
  });

  /* =====================================================
   * PUBLIC API
   *
   * This is the ONLY surface your app should use.
   * ===================================================== */

  return {
    /* ---------- STATE ---------- */
    user,
    role,
    isAuthenticated: !!user,
    loading,

    /* ROLE HELPERS */
    hasRole,
    hasPermission,
    hasAnyPermission,

    /* ---------- CORE ---------- */
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout,

    /* ---------- PASSWORD ---------- */
    forgotPassword: forgotPassword.mutateAsync,
    verifyResetOtp: verifyResetOtp.mutateAsync,
    resetPassword: resetPassword.mutateAsync,

    /* ---------- OTP ---------- */
    sendOtp: sendOtp.mutateAsync,
    verifyOtp: verifyOtp.mutateAsync,
    resendOtp: resendOtp.mutateAsync,

    /* ---------- ACCOUNT ---------- */
    changePassword: changePassword.mutateAsync,
    refreshUser: refreshUser.mutateAsync,

    /* ---------- LOADING STATES ---------- */
    loginLoading: login.isPending,
    registerLoading: register.isPending,
    forgotPasswordLoading: forgotPassword.isPending,
    resetPasswordLoading: resetPassword.isPending,

    /* ---------- ERRORS (NORMALIZED) ---------- */
    authError: login.error,
  };
}
