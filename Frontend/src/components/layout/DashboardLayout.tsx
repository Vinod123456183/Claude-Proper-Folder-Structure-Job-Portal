// 🏗 DashboardLayout — wraps all authenticated pages
// 📦 React + Redux (sidebarOpen)
// Renders Navbar + Sidebar + scrollable content area

import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "../../hooks";

export const DashboardLayout = () => {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main
        className={`main-content ${!sidebarOpen ? "sidebar-collapsed" : ""}`}
        style={{ transition: "margin-left 0.22s ease" }}
      >
        {/* 🔄 Outlet renders the active child route */}
        <Outlet />
      </main>
    </div>
  );
};
