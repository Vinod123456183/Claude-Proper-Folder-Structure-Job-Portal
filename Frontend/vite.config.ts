// ⚡ Vite config — dev server with proxy to backend
// 📦 Vite + @vitejs/plugin-react

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 🔀 Proxy API calls to backend on port 3000
    // This avoids CORS issues in development.
    // In production, Nginx/Caddy handles the same proxying.
    proxy: {
      "/user":        { target: "http://localhost:3000", changeOrigin: true },
      "/company":     { target: "http://localhost:3000", changeOrigin: true },
      "/job":         { target: "http://localhost:3000", changeOrigin: true },
      "/application": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
  build: {
    // 📦 Code splitting: each lazy() import becomes its own chunk
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          redux:  ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
});
