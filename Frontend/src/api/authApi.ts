// 🔐 Auth API — RTK Query endpoints for user auth
// 📦 RTK Query (injected into rootApi)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ Login/Register mutations invalidate "User" tag so any
//    component subscribed to user data auto-updates.
//
// ✅ getProfile uses "User" tag with providesTags so it caches
//    the profile and only refetches when user tag is invalidated.
//
// ✅ Logout invalidates ALL tags → clears the entire cache.
//    This prevents data leakage between different logged-in users
//    on shared devices.
// ─────────────────────────────────────────────────────────────

import { rootApi } from "./baseApi";
import type { User } from "../types";

interface LoginPayload {
  userEmail: string;
  userPassword: string;
  userRole: "student" | "recruiter";
}

interface RegisterPayload {
  userName: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
  userRole: "student" | "recruiter";
}

interface UpdateProfilePayload {
  userName?: string;
  userPhone?: string;
  userBio?: string;
  userSkills?: string;
}

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST /user/login-user
    login: builder.mutation<{ message: string; success: boolean; user: User }, LoginPayload>({
      query: (credentials) => ({
        url: "/user/login-user",
        method: "POST",
        data: credentials,
      }),
      // 🏷 Invalidate User cache so getProfile refetches after login
      invalidatesTags: ["User"],
    }),

    // POST /user/register-user
    register: builder.mutation<{ message: string; success: boolean; user: User }, RegisterPayload>({
      query: (data) => ({
        url: "/user/register-user",
        method: "POST",
        data,
      }),
    }),

    // GET /user/logout-user
    logout: builder.mutation<{ message: string; success: boolean }, void>({
      query: () => ({
        url: "/user/logout-user",
        method: "GET",
      }),
      // 🧹 Nuke entire cache on logout — prevents data leakage “It invalidates cache AND refetches new data automatically” 👉 It clears + refetches (when needed)
      invalidatesTags: ["User", "Jobs", "Job", "Companies", "Company", "Applications", "Applicants"],
    }),

    // PUT /user/update-user/:id
    updateProfile: builder.mutation<
      { message: string; success: boolean; user: User },
      { id: string; data: UpdateProfilePayload }
    >({
      query: ({ id, data }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        data,
      }),
      // 🏷 Invalidate User cache so profile page auto-updates
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
