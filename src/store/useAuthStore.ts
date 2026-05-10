import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// stores
import { useProjectStore } from './useProjectStore';
import { useEventStore } from './useEventStore';
import { useTaskStore } from './useTaskStore';
import { useReminderStore } from './useReminderStore';
import { useNoteStore } from './useNoteStore';
import { useThemeStore } from './useThemeStore';
import { useInvitationStore } from './useInvitationStore';
import { useMemberStore } from './useMemberStore';
// types
import type { User } from '../types/user.type';
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema';
// axios
import api from '../api/axios';
import type { AxiosError } from 'axios';


interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    // Actions
    setUser: (token: string) => Promise<{ success: boolean }>;
    registerUser: (data: RegisterFormValues) => Promise<{ success: boolean; message?: string }>;
    login: (data: LoginFormValues) => Promise<{ success: boolean; message?: string }>;
    setLoading: (loading: boolean) => void;
    logout: () => Promise<{ success: boolean; message?: string }>;
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            loading: true,

            setUser: async (token) => {
                try {
                    const response = await api.get("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const userData = response.data.data.user;
                    
                    set({ user: userData, accessToken: token });
                    return { success: true };
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    return { success: false };
                }
            },

            registerUser: async (data) => {
                try {
                    await api.post("/auth/register", data);
                    return { success: true };
                } catch (err) {
                    const error = err as AxiosError<{ message: string }>;
                    return { 
                        success: false, 
                        message: error.response?.data?.message || "Registration Failed" 
                    };
                }
            },
            
            login: async (data) => {
                try {
                    const response = await api.post("/auth/login", data);
                    const { user, accessToken } = response.data.data;
                    
                    set({ user, accessToken });
                    return { success: true };
                } catch (err) {
                    const error = err as AxiosError<{ message: string }>;
                    return { 
                        success: false, 
                        message: error.response?.data?.message || "Login Failed. Please try again." 
                    };
                }
            },

            setLoading: (loading) => set({ loading }),

            logout: async () => {
                try {
                    await api.post("/auth/logout");
                    
                    set({ user: null, accessToken: null });
                    
                    useProjectStore.persist.clearStorage();
                    useEventStore.persist.clearStorage();
                    useTaskStore.persist.clearStorage();
                    useReminderStore.persist.clearStorage();
                    useNoteStore.persist.clearStorage();
                    useInvitationStore.persist.clearStorage();
                    useMemberStore.persist.clearStorage();
                    useThemeStore.persist.clearStorage();
                    useAuthStore.persist.clearStorage();

                    return { success: true };
                } catch (err) {
                    const error = err as AxiosError<{ message: string }>;
                    return { 
                        success: false, 
                        message: error.response?.data?.message || "Backend logout failed or token already expired"
                    };
                }
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setLoading(false);
            },
        }
    )
);