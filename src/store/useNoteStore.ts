import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Note, NewNote } from "../types/note.type";
import api from "../api/axios";



interface NoteState {
    notes: Record<string, Note[]>;
    isLoading: boolean;
    error: null | string;
    // Actions
    getProjectNotes: (projectId: string) => Promise<void>;
    getNoteById: (projectId: string, noteId: string) => Note | undefined;
    addNote: (note: NewNote, projectId: string) => Promise<void>;
    updateNote: (projectId: string, noteId: string, updates: Partial<Note>) => Promise<boolean>;
    deleteNote: (projectId: string, noteId: string) => Promise<boolean>;
}


export const useNoteStore = create<NoteState>()(
    persist(
        (set, get) => ({
            notes: {},
            isLoading: false,
            error: null,

            
            // get all notes for a project, if notes for the project are already in state, do not fetch from API
            getProjectNotes: async (projectId) => {
                const currentNotes = get().notes[projectId];    
                if (currentNotes !== undefined) {
                    return;
                }
                set({ isLoading: true, error: null });

                try {
                    const res = await api.get(`/projects/${projectId}/notes`);
                    const projectNotes = res.data.data || res.data;
                    set((state) => ({
                        notes: { 
                            ...state.notes, 
                            [projectId]: projectNotes 
                        }
                    }));
                } catch (error) {
                    console.error("Error fetching project notes:", error);
                    set({error: "Failed to fetch project notes" });
                }  finally {
                    set({ isLoading: false });
                }
            },

            // get one note by id, if note is not found in state, return undefined
            getNoteById: (projectId, noteId) => {
                const projectNotes = get().notes[projectId] || [];
                const note = projectNotes.find((n) => n._id === noteId);
                if (!note) {
                    console.warn(`Note with id ${noteId} not found in state.`);
                }
                return note;
            },

            // add a new note to a project, on success add the new note to state, on failure set error message in state
            addNote: async (note, projectId) => {
                set({ isLoading: true, error: null });

                try {
                    const res = await api.post(`/projects/${projectId}/notes`, note);
                    const newNote = res.data.data || res.data;
                    set((state) => ({
                        notes: {
                            ...state.notes,
                            [projectId]: [...(state.notes[projectId] || []), newNote]
                        }
                    }));    
                } catch (error) {
                    console.error("Error adding note:", error);
                    set({ error: "Failed to add note" });
                }  finally {
                    set({ isLoading: false });
                }
            },

            // update a note by id, on success update the note in state, on failure set error message in state
            updateNote: async (projectId, noteId, updates) => {
                set({ isLoading: true, error: null });

                try {
                    const res = await api.patch(`/projects/${projectId}/notes/${noteId}`, updates);
                    const updatedNote = res.data.data || res.data;
                    set((state) => ({
                        notes: {
                            ...state.notes,
                            [projectId]: state.notes[projectId].map((n) =>
                                n._id === noteId ? { ...n, ...updatedNote } : n
                            )
                        }
                    }));
                    return true;
                } catch (error) {
                    console.error("Error updating note:", error);
                    set({error: "Failed to update note" });
                    return false;
                }  finally {
                    set({ isLoading: false });
                }
            },

            // delete a note by id, on success remove the note from state, on failure set error message in state
            deleteNote: async (projectId, noteId) => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete(`/projects/${projectId}/notes/${noteId}`);
                    set((state) => ({
                        notes: {
                            ...state.notes,
                            [projectId]: state.notes[projectId].filter((n) => n._id !== noteId)
                        }
                    }));
                    return true;
                } catch (error) {
                    console.error("Error deleting note:", error);
                    set({ error: "Failed to delete note" });
                    return false;
                }  finally {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: "note-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ notes: state.notes }),
        }
    )
);