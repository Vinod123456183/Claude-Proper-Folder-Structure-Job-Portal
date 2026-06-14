// 🏪 Redux Store — single source of truth
// 📦 Redux Toolkit + RTK Query
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ rootApi.middleware handles RTK Query cache lifecycle:
//    subscription tracking, garbage collection, polling,
//    background refetch. Must be included or caching breaks.
//
// ✅ Store shape:
//    store.auth      → AuthState (user, isAuthenticated, role)
//    store.ui        → UiState (sidebar, filters)
//    store.api       → RTK Query cache (all server data)
//
// ✅ TypeScript: RootState and AppDispatch exported for typed
//    useSelector / useDispatch everywhere in the app.
// ─────────────────────────────────────────────────────────────

import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from "../api/baseApi";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [rootApi.reducerPath]: rootApi.reducer,  // 📦 RTK Query cache
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware), // ♻️ cache lifecycle
});

// ─── Typed hooks ─────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
