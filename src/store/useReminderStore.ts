import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Reminder, NewReminder } from "../types/reminder.type";
import api from "../api/axios";
import { useAuthStore } from "./useAuthStore";

interface ReminderState {
    reminders: Record<string, Reminder[]>; 
    isLoading: boolean;
    isOwner: boolean; 
    error: null | string;
    // Actions
    setIsOwner: (reminder: Reminder) => void;
    getProjectReminders: (projectId: string) => Promise<void>;
    getReminderById: (projectId: string, reminderId: string) => Reminder | undefined;
    addReminder: (reminder: NewReminder, projectId: string) => Promise<void>;
    updateReminder: (projectId: string, reminderId: string, updates: Partial<Reminder>) => Promise<boolean>;
    deleteReminder: (projectId: string, reminderId: string) => Promise<boolean>;
}


export const useReminderStore = create<ReminderState>()(
    persist(
        (set, get) => ({
            reminders: {},
            isLoading: false,
            error: null,
            isOwner: false,

            // check if current user is the creator of the note, set isOwner to true if they are, otherwise set to false
            setIsOwner: (reminder) => {
                const currentUser = useAuthStore.getState().user;
                        
                if (!currentUser || !reminder) {
                    set({ isOwner: false });
                    return;
                }
            
                const creatorId = reminder.creator?._id 
                const currentUserId = currentUser._id;
            
                const checkOwner = String(creatorId).trim() === String(currentUserId).trim();
                set({ isOwner: checkOwner });
            },

            // Fetch reminders for a specific project and store them in state
            getProjectReminders: async (projectId) => {
                // const currentReminders = get().reminders[projectId];
                // if (currentReminders !== undefined) {
                //     return;
                // }
                set({ isLoading: true, error: null });

                try {
                    const response = await api.get(`/projects/${projectId}/reminders`);
                    const projectReminders = response.data.data || response.data;
                    set((state) => ({
                        reminders: { 
                            ...state.reminders, 
                            [projectId]: projectReminders 
                        }
                    }));
                } catch (error) {
                    console.error("Error fetching reminders:", error);
                    set({ error: "Failed to fetch reminders" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // Get a specific reminder by ID from the state
            getReminderById(projectId, reminderId) {
                const projectReminders = get().reminders[projectId] || [];
                const reminder = projectReminders.find((r) => r._id === reminderId);
                if (!reminder) {
                    console.warn(`Reminder with id ${reminderId} not found in state.`);
                }
                return reminder;
            },

            // Create a new reminder for a project and update state
            addReminder: async (reminder, projectId) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await api.post(`/projects/${projectId}/reminders`, reminder);
                    const newReminder = response.data.data || response.data;
                    set((state) => ({
                        reminders: {
                            ...state.reminders,
                            [projectId]: [...(state.reminders[projectId] || []), newReminder],
                        },
                    }));
                } catch (error) {
                    console.error("Error adding reminder:", error);
                    set({ error: "Failed to add reminder" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // Update an existing reminder and update state
            updateReminder: async (projectId, reminderId, updates) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await api.patch(`/projects/${projectId}/reminders/${reminderId}`, updates);
                    const updatedReminder = response.data.data || response.data;
                    set((state) => ({
                        reminders: {
                            ...state.reminders,
                            [projectId]: state.reminders[projectId].map((r) =>
                                r._id === reminderId ? { ...r, ...updatedReminder } : r
                            ),
                        },
                    }));
                    return true;
                } catch (error) {
                    console.error("Error updating reminder:", error);
                    set({ error: "Failed to update reminder" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // Delete a reminder and update state
            deleteReminder: async (projectId, reminderId) => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete(`/projects/${projectId}/reminders/${reminderId}`);
                    set((state) => ({
                        reminders: {
                            ...state.reminders,
                            [projectId]: state.reminders[projectId].filter((r) => r._id !== reminderId),
                        },
                    }));
                    return true;
                } catch (error) {
                    console.error("Error deleting reminder:", error);
                    set({ error: "Failed to delete reminder" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: "reminder-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ reminders: state.reminders }),
        }
    )
)