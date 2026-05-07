"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DensityMode, ThemeMode } from "@/types/common";

interface UiState {
  theme: ThemeMode;
  density: DensityMode;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  setTheme: (t: ThemeMode) => void;
  setDensity: (d: DensityMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "dark",
      density: "comfortable",
      sidebarCollapsed: false,
      commandOpen: false,
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
    }),
    {
      name: "drb:ui",
      partialize: (s) => ({
        theme: s.theme,
        density: s.density,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
);
