// 🔧 RTK Query — base API setup shared by all API slices
// 📦 Used by: authApi, jobApi, companyApi, applicationApi
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ fetchBaseQuery wraps our axiosInstance so all RTK Query
//    calls flow through the same interceptors (401 handling,
//    timeout, credential attachment).
//
// ✅ tagTypes declared here = single source of truth for all
//    cache invalidation across the entire app.
//    Adding a new entity? Add its tag here.
//
// ✅ refetchOnFocus: true → when user switches tabs and comes
//    back, stale data silently refreshes. Zero stale reads.
//
// ✅ refetchOnReconnect: true → if user loses wifi and regains
//    connection, cache auto-heals. Critical for mobile users.
// ─────────────────────────────────────────────────────────────

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom baseQuery that wraps axios so interceptors still fire
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

// ─── Axios-based baseQuery (interceptors stay active) ────
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: unknown;
      params?: unknown;
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// ─── Root API — all slices inject endpoints into this ────
export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  refetchOnFocus: true, // ♻️ refetch when tab regains focus
  refetchOnReconnect: true, // ♻️ refetch after network reconnect
  // 🏷 All cache tags across the app declared here
  tagTypes: [
    "User",
    "Jobs",
    "Job",
    "Companies",
    "Company",
    "Applications",
    "Applicants",
  ],
  endpoints: () => ({}), // endpoints injected by each api file
});
