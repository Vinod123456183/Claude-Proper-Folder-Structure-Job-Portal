// 🔐 Auth Slice — global auth state
// 📦 Redux Toolkit (RTK)
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ Persisted to localStorage so page refresh doesn't log
//    the user out. On app boot, main.tsx hydrates this from
//    localStorage before rendering the tree.
//
// ✅ Listens for "auth:unauthorized" CustomEvent dispatched
//    by axiosInstance interceptor when any API returns 401.
//    This avoids circular import between axios and the store.
//
// ✅ role stored separately (derived from user.userRole) for
//    O(1) role checks in route guards without needing to read
//    the full user object every render.
// ─────────────────────────────────────────────────────────────

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types";

// ─── Hydrate from localStorage on first load ─────────────
const savedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  role: savedUser ? (JSON.parse(savedUser) as User).userRole : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔐 Called after successful login/register
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.userRole;
      // 💾 Persist to localStorage — survives page refresh
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // 🔓 Called on logout or 401 interceptor
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      // 🗑 Remove from localStorage
      localStorage.removeItem("user");
    },

    // 🔄 Update user fields after profile update
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
