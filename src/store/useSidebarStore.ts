import { create } from "zustand";
import { type ReactNode } from "react";


interface SidebarState {
    content: ReactNode | null;
    // Actions
    setContent: (newContent: ReactNode | null) => void;
    clearSidebar: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
    content: null,
    setContent: (newContent) => set({ content: newContent }),
    clearSidebar: () => set({ content: null }),
}));