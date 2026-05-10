// store/useConfirmModal.ts
import { create } from 'zustand';

interface ConfirmModalStore {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => Promise<void> | void;
    // Actions
    onOpen: (data: { 
        title: string; 
        description: string; 
        confirmText?: string; 
        onConfirm: () => Promise<void> | void 
    }) => void;
    onClose: () => void;
}

export const useConfirmModal = create<ConfirmModalStore>((set) => ({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {},
    onOpen: (data) => set({ 
        isOpen: true, 
        title: data.title, 
        description: data.description, 
        confirmText: data.confirmText || 'Confirm',
        onConfirm: data.onConfirm 
    }),
    onClose: () => set({ isOpen: false }),
}));