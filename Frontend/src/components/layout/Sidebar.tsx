// 🗂 Sidebar — role-aware navigation sidebar
// 📦 React Router (NavLink) + Redux (sidebarOpen) + useAuth
// 🎨 Collapsible sidebar with role-specific nav items

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Search, BookMarked, User,
  Building2, PlusCircle, ListOrdered, Users, ChevronLeft, ChevronRight, Briefcase,
} from "lucide-react";
import { useAuth, useAppDispatch, useAppSelector } from "../../hooks";
import { setSidebarOpen } from "../../store/slices/uiSlice";

// ─── Nav item definitions per role ───────────────────────
const studentNav = [
  { to: "/student/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { to: "/student/jobs",       label: "Browse Jobs",  icon: Search },
  { to: "/student/applied",    label: "Applied Jobs", icon: BookMarked },
  { to: "/student/profile",    label: "My Profile",   icon: User },
];

const recruiterNav = [
  { to: "/recruiter/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { to: "/recruiter/companies",  label: "My Companies", icon: Building2 },
  { to: "/recruiter/companies/new", label: "New Company", icon: PlusCircle },
  { to: "/recruiter/jobs",       label: "My Jobs",      icon: ListOrdered },
  { to: "/recruiter/jobs/new",   label: "Post a Job",   icon: Briefcase },
];

export const Sidebar = () => {
  const { role } = useAuth();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const navItems = role === "recruiter" ? recruiterNav : studentNav;

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 99,
      width: open ? "var(--sidebar-w)" : "64px",
      background: "var(--bg2)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      paddingTop: "var(--nav-h)",
      transition: "width 0.22s ease",
      overflow: "hidden",
    }}>
      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.endsWith("dashboard")}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              fontWeight: isActive ? 500 : 400,
              color: isActive ? "var(--accent)" : "var(--muted)",
              background: isActive ? "rgba(245,166,35,0.08)" : "transparent",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            })}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => dispatch(setSidebarOpen(!open))}
        style={{
          margin: "12px 8px",
          padding: "8px",
          borderRadius: "var(--radius)",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          color: "var(--muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
};
