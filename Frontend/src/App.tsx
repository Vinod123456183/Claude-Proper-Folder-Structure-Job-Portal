// 🗺 App.tsx — root router with all route guards
// 📦 React Router v6 + React.lazy (code splitting) + Suspense
//
// SCALABILITY NOTES:
// ─────────────────────────────────────────────────────────────
// ✅ React.lazy() — every page is a separate JS chunk.
//    Initial bundle only includes Auth pages + shell.
//    Student/Recruiter pages load only when user navigates there.
//
// ✅ 3-level route guard hierarchy:
//    PublicOnlyRoute  → / /login /register (redirect if logged in)
//    ProtectedRoute   → all dashboard routes (redirect if logged out)
//    RoleRoute        → student/* vs recruiter/* (redirect wrong role)
//
// ✅ useEffect listens for "auth:unauthorized" CustomEvent fired
//    by axiosInstance interceptor on 401 responses. Clears auth
//    state and redirects without circular import issues.
// ─────────────────────────────────────────────────────────────

import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PublicOnlyRoute, ProtectedRoute, RoleRoute } from "./routes/Guards";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { useAppDispatch } from "./hooks";
import { clearUser } from "./store/slices/authSlice";

// ─── Lazy-loaded pages (code splitting per route) ────────
const Login    = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Student pages
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const BrowseJobs       = lazy(() => import("./pages/student/BrowseJobs"));
const JobDetail        = lazy(() => import("./pages/student/JobDetail"));
const AppliedJobs      = lazy(() => import("./pages/student/AppliedJobs"));
const StudentProfile   = lazy(() => import("./pages/student/StudentProfile"));

// Recruiter pages
const RecruiterDashboard = lazy(() => import("./pages/recruiter/RecruiterDashboard"));
const MyCompanies        = lazy(() => import("./pages/recruiter/MyCompanies"));
const PostJob            = lazy(() => import("./pages/recruiter/PostJob"));
const MyJobs             = lazy(() => import("./pages/recruiter/MyJobs"));
const Applicants         = lazy(() => import("./pages/recruiter/Applicants"));

// ─── Fallback spinner while lazy chunk loads ─────────────
const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="spinner" style={{ width: 28, height: 28 }} />
  </div>
);

export default function App() {
  const dispatch = useAppDispatch();

  // 🔐 Global 401 listener — axiosInstance fires this event
  // when any API call returns 401 (token expired/invalid).
  // Clears auth state without circular import between axios and store.
  useEffect(() => {
    const handle = () => {
      dispatch(clearUser());
      window.location.href = "/login"; // hard redirect clears all state
    };
    window.addEventListener("auth:unauthorized", handle);
    return () => window.removeEventListener("auth:unauthorized", handle);
  }, [dispatch]);

  return (
    <BrowserRouter>
      {/* 🍞 Toast notifications — top-right, styled to match dark theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "var(--green)", secondary: "var(--bg2)" } },
          error:   { iconTheme: { primary: "var(--red)",   secondary: "var(--bg2)" } },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Public-only routes (redirect if already logged in) ── */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Protected routes (require auth) ─────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              {/* ── Student-only routes ── */}
              <Route element={<RoleRoute allowed="student" />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/jobs"       element={<BrowseJobs />} />
                <Route path="/student/jobs/:jobId" element={<JobDetail />} />
                <Route path="/student/applied"    element={<AppliedJobs />} />
                <Route path="/student/profile"    element={<StudentProfile />} />
              </Route>

              {/* ── Recruiter-only routes ── */}
              <Route element={<RoleRoute allowed="recruiter" />}>
                <Route path="/recruiter/dashboard"           element={<RecruiterDashboard />} />
                <Route path="/recruiter/companies"           element={<MyCompanies />} />
                <Route path="/recruiter/companies/new"       element={<MyCompanies />} />
                <Route path="/recruiter/jobs"                element={<MyJobs />} />
                <Route path="/recruiter/jobs/new"            element={<PostJob />} />
                <Route path="/recruiter/applicants/:jobId"   element={<Applicants />} />
              </Route>

            </Route>
          </Route>

          {/* ── Default redirect ────────────────────────────────── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
