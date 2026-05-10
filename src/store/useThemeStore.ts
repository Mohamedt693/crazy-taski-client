import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    isDarkMode: boolean;
    // Actions
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDarkMode: false,
            toggleTheme: () =>
                set((state) => {
                    const newMode = !state.isDarkMode;
                    document.documentElement.classList.toggle('dark', newMode);
                    return { isDarkMode: newMode };
                }),
        }),
        {
            name: 'theme-storage', 
        }
    )
);