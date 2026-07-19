import { create } from "zustand";

// Load values from localStorage
const localTheme =
  typeof window !== "undefined"
    ? localStorage.getItem("nepcart-theme") || "dark"
    : "dark";

const localLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("nepcart-language") || "EN"
    : "EN";

const localMaxPrice =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("nepcart-max-price")) || 1000
    : 1000;

const localSearchTerm =
  typeof window !== "undefined"
    ? localStorage.getItem("nepcart-search-term") || ""
    : "";

// Apply theme on initial load
if (typeof window !== "undefined") {
  if (localTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useUiStore = create((set) => ({
  theme: localTheme,
  language: localLanguage,
  searchTerm: localSearchTerm,
  maxPrice: localMaxPrice,

  setSearchTerm: (searchTerm) => {
    localStorage.setItem("nepcart-search-term", searchTerm);
    set({ searchTerm });
  },

  setMaxPrice: (maxPrice) => {
    localStorage.setItem("nepcart-max-price", String(maxPrice));
    set({ maxPrice });
  },

  setLanguage: (language) => {
    localStorage.setItem("nepcart-language", language);
    set({ language });
  },

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";

      if (typeof window !== "undefined") {
        localStorage.setItem("nepcart-theme", nextTheme);

        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }

      return { theme: nextTheme };
    }),
}));
