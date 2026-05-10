import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Event, NewEvent } from "../types/event.type";
import api from "../api/axios";


interface EventState {
    events: Record<string, Event[]>; 
    isLoading: boolean;
    error: null | string;
    // Actions
    getProjectEvents: (projectId: string) => Promise<void>;
    getEventById: (projectId: string, eventId: string) => Event | undefined;
    addEvent: (event: NewEvent, projectId: string) => Promise<void>;
    updateEvent: (projectId: string, eventId: string, update: Partial<Event>) => Promise<boolean>;
    deleteEvent: (projectId: string, eventId: string) => Promise<boolean>;
}


export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: {},
            isLoading: false,
            error: null,

            // get all events for a project, if events for the project are already in state, do not fetch from API
            getProjectEvents: async (projectId) => {
                const currentEvents = get().events[projectId];
                if (currentEvents !== undefined) {
                    return;
                }
                set({ isLoading: true, error: null });

                try {
                    const response = await api.get(`/projects/${projectId}/events`);
                    const projectEvents = response.data.data || response.data;
                    set((state) => ({
                        events: { 
                            ...state.events, 
                            [projectId]: projectEvents 
                        }
                    }));
                } catch (error) {
                    console.error("Error fetching event:", error);
                    set({ error: "Failed to fetch event" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // get a specific event by id from state, if not found return undefined
            getEventById(projectId, eventId) {
                const projectevents = get().events[projectId] || [];
                const event = projectevents.find((e) => e._id === eventId);
                if (!event) {
                    console.warn(`Event with id ${eventId} not found in state.`);
                }
                return event;
            },

            // add a new event to a project, update state with new event, if API call fails set error message in state
            addEvent: async (event, projectId) => {
                set({ isLoading: true, error: null});

                try {
                    const response = await api.post(`/projects/${projectId}/events`, event);
                    const newEvent = response.data.data || response.data;

                    set((state) => ({
                        events: {
                            ...state.events,
                            [projectId]: [...(state.events[projectId] || []), newEvent]
                        }
                    }));
                } catch (error) {
                    console.error("Error adding event:", error);
                    set({ error: "Failed to add event" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // update an event by id, on success update the event in state, on failure set error message in state
            updateEvent: async (projectId, eventId, updates) => {
                set({isLoading: true, error: null});

                try {
                    const response = await api.patch(`/projects/${projectId}/events/${eventId}`, updates);
                    const updatedEvent = response.data.data || response.data;

                    set((state) => ({
                        events: {
                            ...state.events,
                            [projectId]: (state.events[projectId] || []).map((e) =>
                                e._id === eventId ? { ...e, ...updatedEvent } : e
                            ),
                        },
                    }));
                    return true;
                } catch (error) {
                    console.error("Error updating event:", error);
                    set({ error: "Failed to update event" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // delete an event by id, on success remove the event from state, on failure set error message in state
            deleteEvent: async (projectId, eventId) => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete(`/projects/${projectId}/events/${eventId}`);
                    set((state) => ({
                        events: {
                            ...state.events,
                            [projectId]: (state.events[projectId] || []).filter((e) => e._id !== eventId),
                        },
                    }));
                    return true;
                } catch (error) {
                    console.error("Error deleting event:", error);
                    set({ error: "Failed to delete event" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),

        {
            name: "events-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ events: state.events }),
        }
    )
)