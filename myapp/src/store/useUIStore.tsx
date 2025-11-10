import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean; // mobile
  sidebarCollapsed: boolean; // desktop
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
}

// Helper to load theme from localStorage or system preference
const getInitialDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("darkMode");
  if (saved !== null) return JSON.parse(saved);
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  darkMode: getInitialDarkMode(),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  toggleDarkMode: () =>
    set((s) => {
      const newMode = !s.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newMode);
      }
      return { darkMode: newMode };
    }),

  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  setDarkMode: (v) => {
    localStorage.setItem("darkMode", JSON.stringify(v));
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", v);
    }
    set({ darkMode: v });
  },
}));

// Apply correct mode instantly on app load
if (typeof window !== "undefined") {
  const saved = getInitialDarkMode();
  document.documentElement.classList.toggle("dark", saved);
}
