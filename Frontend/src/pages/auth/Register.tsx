// 📝 Register Page
// 📦 React (useState) + RTK Query (useRegisterMutation) + Redux (setUser) + React Router
// 🔒 SECURITY: PublicOnlyRoute wraps this — logged-in users are redirected away
// 🔒 SECURITY: Role is whitelisted — only "student" and "recruiter" allowed (server enforces too)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "../../api/authApi";
import { useLoginMutation } from "../../api/authApi";
import { setUser } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../hooks";
import toast from "react-hot-toast";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "", userEmail: "", userPhone: "",
    userPassword: "", userRole: "student" as "student" | "recruiter",
  });
  const [showPass, setShowPass] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.userPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await register(form).unwrap();
      // 🔄 Auto-login after registration
      const loginRes = await login({
        userEmail: form.userEmail,
        userPassword: form.userPassword,
        userRole: form.userRole,
      }).unwrap();
      dispatch(setUser(loginRes.user));
      toast.success("Account created! Welcome aboard 🎉");
      navigate(form.userRole === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Registration failed");
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="input-label">{label}</label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required
      />
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 70%)",
      padding: "40px 20px",
    }}>
      <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          }}>
            <Briefcase size={22} style={{ color: "var(--accent)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Create account
          </h1>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>Join thousands of professionals</p>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Role toggle */}
          <div>
            <label className="input-label">I am a</label>
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
                  {r === "student" ? "👨‍🎓 Student" : "🏢 Recruiter"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {field("userName", "Full Name", "text", "John Doe")}
            {field("userEmail", "Email", "email", "you@example.com")}
            {field("userPhone", "Phone Number", "tel", "+91 9876543210")}

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.userPassword}
                  onChange={(e) => setForm({ ...form, userPassword: e.target.value })}
                  required
                  minLength={6}
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
              {isLoading
                ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating account…</>
                : "Create account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--muted)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
