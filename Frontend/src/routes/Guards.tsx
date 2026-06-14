// 🔒 Route Guards — 3-level security for all routes
// 📦 React Router v6 + Redux (useAuth)
//
// SECURITY MODEL:
// ─────────────────────────────────────────────────────────────
// PublicOnlyRoute  → /login, /register
//   Logged-in users get bounced to their dashboard.
//   Prevents re-login if already authenticated.
//
// ProtectedRoute   → any authenticated page
//   Unauthenticated users → /login
//   Preserves the attempted URL in location.state so
//   after login they land on the page they wanted.
//
// RoleRoute        → student-only or recruiter-only pages
//   Wrong role → redirected to their own dashboard.
//   Prevents a student from ever loading a recruiter page
//   (even if they type the URL directly).
//
// NOTE: These are UI guards. The server enforces the same
// rules at the API level. Never rely solely on frontend guards.
// ─────────────────────────────────────────────────────────────

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";

// ─── 1. Must be logged out ────────────────────────────────
export const PublicOnlyRoute = () => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    // 🔄 Redirect to role-specific dashboard
    return <Navigate to={role === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard"} replace />;
  }
  return <Outlet />;
};

// ─── 2. Must be logged in ─────────────────────────────────
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // 🔐 Save attempted URL → redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

// ─── 3. Must be a specific role ───────────────────────────
export const RoleRoute = ({ allowed }: { allowed: "student" | "recruiter" }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role !== allowed) {
    // 🚫 Wrong role → their own dashboard
    return <Navigate to={role === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard"} replace />;
  }
  return <Outlet />;
};
