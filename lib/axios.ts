/**
 * api.ts
 *
 * - Central Axios instance
 * - Network-tab level logs
 * - Auto refresh token & retry
 */

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authEvents } from "./authEvents";

/* ================= CONFIG ================= */

const API_BASE_URL = "https://your-api.com"; // 🔴 CHANGE
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ENABLE_API_LOGS = true;

/* ================= AXIOS ================= */

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/* ================= LOGGER HELPERS ================= */

const log = (...args: any[]) => ENABLE_API_LOGS && console.log(...args);
const divider = () =>
  ENABLE_API_LOGS && console.log("────────────────────────────");

/* ================= REQUEST ================= */

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  (config as any)._startTime = Date.now();

  log("\n🟡 API REQUEST");
  log("➡️", config.method?.toUpperCase(), config.url);
  log("📦 Body:", config.data);

  return config;
});

/* ================= REFRESH TOKEN ================= */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((p) =>
    token ? p.resolve(token) : p.reject(error)
  );
  failedQueue = [];
};

async function refreshToken() {
  const refresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
    refresh,
  });

  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
  return res.data.access;
}

/* ================= RESPONSE ================= */

api.interceptors.response.use(
  (res) => {
    const time =
      Date.now() - ((res.config as any)._startTime ?? Date.now());

    log("🟢 API RESPONSE", res.config.url, `${time}ms`);
    divider();
    return res;
  },

  async (error: AxiosError & { config: any }) => {
    const originalRequest = error.config;

    const normalizedError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Request failed",
      raw: error.response?.data,
    };

    if (normalizedError.status === 401) {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
  ]);

  authEvents.emitLogout();

    log("🔴 API ERROR", originalRequest?.url, normalizedError);

    /* ---------- AUTO REFRESH ---------- */
    if (
      normalizedError.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await AsyncStorage.multiRemove([
          ACCESS_TOKEN_KEY,
          REFRESH_TOKEN_KEY,
        ]);
      } finally {
        isRefreshing = false;
      }
    }

    divider();
    return Promise.reject(normalizedError);
  }
);
