// 🎛 UI Slice — ephemeral UI state (never persisted)
// 📦 Redux Toolkit (RTK)

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UiState } from "../../types";

const initialState: UiState = {
  sidebarOpen: true,
  searchQuery: "",
  jobFilters: {
    location: "",
    jobType: "",
    salaryMin: 0,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setJobFilters(state, action: PayloadAction<Partial<UiState["jobFilters"]>>) {
      state.jobFilters = { ...state.jobFilters, ...action.payload };
    },
    resetFilters(state) {
      state.jobFilters = { location: "", jobType: "", salaryMin: 0 };
      state.searchQuery = "";
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setSearchQuery, setJobFilters, resetFilters } =
  uiSlice.actions;
export default uiSlice.reducer;
