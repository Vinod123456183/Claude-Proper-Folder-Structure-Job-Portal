// 🔐 Login Page
// 📦 React (useState) + RTK Query (useLoginMutation) + Redux (setUser) + React Router
// 🔒 SECURITY: PublicOnlyRoute wraps this — logged-in users are redirected away

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../../api/authApi";
import { setUser } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // 🔄 After login, go back to the page they tried to visit
  const from = (location.state as any)?.from?.pathname ?? null;

  const [form, setForm] = useState({ userEmail: "", userPassword: "", userRole: "student" as "student" | "recruiter" });
  const [showPass, setShowPass] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setUser(res.user));          // 💾 save user to Redux + localStorage
      toast.success(res.message);
      // 🔄 Redirect to role dashboard or original destination
      const dest = from ?? (res.user.userRole === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard");
      navigate(dest, { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Login failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 70%)",
    }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <Briefcase size={22} style={{ color: "var(--accent)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Welcome back
          </h1>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Role toggle */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            background: "var(--bg3)", borderRadius: "var(--radius)", padding: 3,
          }}>
            {(["student", "recruiter"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, userRole: r })}
                style={{
                  padding: "7px",
                  borderRadius: 7,
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  background: form.userRole === r ? "var(--bg2)" : "transparent",
                  color: form.userRole === r ? "var(--accent)" : "var(--muted)",
                  boxShadow: form.userRole === r ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.userEmail}
                onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.userPassword}
                  onChange={(e) => setForm({ ...form, userPassword: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "var(--muted)", padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={isLoading} style={{ marginTop: 4 }}>
              {isLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</> : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--muted)", fontSize: "0.875rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
