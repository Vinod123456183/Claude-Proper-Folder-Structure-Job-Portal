// 🧭 Navbar — top navigation bar
// 📦 React + Redux (useAuth) + React Router + RTK Query (logout)
// 🎨 Sticky top bar with user avatar, role badge, logout

import { useNavigate } from "react-router-dom";
import { Menu, LogOut, Briefcase, User } from "lucide-react";
import { useAuth, useAppDispatch } from "../../hooks";
import { useLogoutMutation } from "../../api/authApi";
import { clearUser } from "../../store/slices/authSlice";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

export const Navbar = () => {
  const { user, role } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Even if server call fails, clear local state
    } finally {
      dispatch(clearUser());         // 🔐 clear Redux auth state
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    }
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "var(--nav-h)",
      background: "rgba(13,14,17,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 20px",
      gap: "12px",
    }}>
      {/* Sidebar toggle */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => dispatch(toggleSidebar())}
        style={{ padding: "6px" }}
      >
        <Menu size={18} />
      </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Briefcase size={18} style={{ color: "var(--accent)" }} />
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: "1rem",
          letterSpacing: "-0.02em",
        }}>
          JobPortal
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Role badge */}
      <span className={`badge ${role === "recruiter" ? "badge-purple" : "badge-blue"}`}>
        {role}
      </span>

      {/* User avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--bg3)",
          border: "2px solid var(--border2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 600,
          color: "var(--accent)",
        }}>
          {user?.userProfile?.userProfilePic
            ? <img src={user.userProfile.userProfilePic} alt="avatar" style={{ width: "100%", borderRadius: "50%" }} />
            : getInitials(user?.userName ?? "U")}
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {user?.userName?.split(" ")[0]}
        </span>
      </div>

      {/* Logout */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={handleLogout}
        disabled={isLoading}
        title="Logout"
      >
        {isLoading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <LogOut size={15} />}
      </button>
    </nav>
  );
};
