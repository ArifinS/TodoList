"use client";

import { create } from 'zustand';

type ThemeState = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};
const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleTheme: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
export default useThemeStore;