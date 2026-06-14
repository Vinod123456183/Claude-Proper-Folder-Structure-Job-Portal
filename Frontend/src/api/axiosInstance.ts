// 🔧 Axios — single instance with interceptors
// 📦 Used by: RTK Query baseQuery (all API slices)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ credentials: true → httpOnly JWT cookie auto-attached
//    on every request. No token handling in frontend code.
//
// ✅ Request interceptor → single place to attach any future
//    headers (e.g. X-Request-ID for tracing, API versioning).
//
// ✅ Response interceptor → catches 401 globally.
//    Dispatches logout action and redirects to /login.
//    No need to handle 401 in every component individually.
//
// ✅ Timeout: 15s → prevents zombie requests hanging forever.
//    Important at scale when server is under load.
// ─────────────────────────────────────────────────────────────

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",                  // Vite proxy handles /user, /job, etc.
  withCredentials: true,         // 🔐 sends httpOnly cookie on every request
  timeout: 15000,                // ⏱ 15s timeout — abort stale requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ─────────────────────────────────
// Future: add X-Request-ID, tracing headers, API version
axiosInstance.interceptors.request.use(
  (config) => {
    // 📌 Good place to add: config.headers["X-Client-Version"] = "1.0.0"
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────
// Handles 401 globally → clears auth, redirects to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔐 Token expired or invalid → force logout
      // Importing store here would create circular deps,
      // so we dispatch a custom event that authSlice listens for.
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
