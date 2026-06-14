// 🚀 main.tsx — app entry point
// 📦 React 18 + Redux Provider + React Hot Toast
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ React 18 createRoot — enables concurrent features:
//    useTransition, useDeferredValue, Suspense streaming.
//    These are essential for keeping the UI responsive under
//    heavy data loads (e.g. large job lists, many applicants).
//
// ✅ Redux store is hydrated from localStorage in authSlice
//    before this file even runs — user session survives refresh.
//
// ✅ StrictMode in development → double-invokes effects to catch
//    bugs early. Removed in production build automatically.
// ─────────────────────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 🏪 Redux Provider — makes store available to entire tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
