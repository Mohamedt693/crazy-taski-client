import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useProjectStore } from "./useProjectStore";
import type { Invitation, NewInvitation } from "../types/invitations.type";
import api from "../api/axios";


interface UserInvitationState {
    myInvitations: Invitation[]; 
    projectInvitations: Record<string, Invitation[]>; 
    isLoading: boolean;
    error: null | string;
    // Actions
    getProjectInvitations: (projectId: string) => Promise<void>;
    inviteMember: (member: NewInvitation, projectId: string) => Promise<boolean>;
    getMyInvitations: () => Promise<void>;
    acceptInvitation: (invitationId: string) => Promise<boolean>;
    declineInvitation: (invitationId: string) => Promise<boolean>;
    cancelInvitation: (projectId: string, invitationId: string) => Promise<boolean>;
}


export const useInvitationStore = create<UserInvitationState>()(
    persist(
        (set, get) => ({
            myInvitations: [],
            projectInvitations: {},
            isLoading: false,
            error: null,

            // fetch all invitations for a project, if there are already invitations for the project in state, do not fetch from API
            getMyInvitations: async () => {
                const currentInvites = get().myInvitations;
                if (currentInvites.length === 0) set({ isLoading: true });
                set({ error: null });

                try {
                    const response = await api.get("/invitations/my-invitations");
                    const data = response.data.data || response.data;
                    set({ myInvitations: data });
                } catch (error) {
                    console.error("Fetch my invitations error:", error);
                    set({ error: "Failed to load your invitations" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // fetch all invitations for a project, if there are already invitations for the project in state, do not fetch from API
            getProjectInvitations: async (projectId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get(`/projects/${projectId}/invitations`);
                    const data = response.data.data || response.data;
                    set((state) => ({
                        projectInvitations: {
                            ...state.projectInvitations,
                            [projectId]: data
                        }
                    }));
                } catch (error) {
                    console.error("Fetch project invitations error:", error);
                    set({ error: "Failed to fetch project invitations" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // invite a member to a project, if successful, add the new invitation to projectInvitations in state, otherwise set error message in state
            inviteMember: async (member, projectId) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post(`/projects/${projectId}/invitations`, member);
                    const newInvite = response.data.data || response.data;
                    
                    set((state) => ({
                        projectInvitations: {
                            ...state.projectInvitations,
                            [projectId]: [...(state.projectInvitations[projectId] || []), newInvite]
                        }
                    }));
                    return true;
                } catch (error) {
                    console.error("Invite Member Error:", error);
                    set({ error: "Failed to send invitation" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // accept an invitation, if successful, remove the invitation from myInvitations in state and fetch projects to update project list, otherwise set error message in state
            acceptInvitation: async (invitationId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.patch(`/invitations/${invitationId}/accept`);
                    
                    set((state) => ({
                        myInvitations: state.myInvitations.filter((inv) => inv._id !== invitationId)
                    }));

                    await useProjectStore.getState().getProjects();
                    return true;
                } catch (error) {
                    console.error("Accept invitation error:", error);
                    set({ error: "Failed to accept invitation" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // decline an invitation, if successful, remove the invitation from myInvitations in state, otherwise set error message in state
            declineInvitation: async (invitationId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.patch(`/invitations/${invitationId}/decline`);
                    
                    set((state) => ({
                        myInvitations: state.myInvitations.filter((inv) => inv._id !== invitationId)
                    }));
                    return true;
                } catch (error) {
                    console.error("Decline invitation error:", error);
                    set({ error: "Failed to decline invitation" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // cancel an invitation, if successful, remove the invitation from projectInvitations in state, otherwise set error message in state
            cancelInvitation: async (projectId, invitationId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/projects/${projectId}/invitations/${invitationId}`);
                    
                    set((state) => ({
                        projectInvitations: {
                            ...state.projectInvitations,
                            [projectId]: state.projectInvitations[projectId].filter(i => i._id !== invitationId)
                        }
                    }));
                    return true;
                } catch (error) {
                    console.error("Cancel invitation error:", error);
                    set({ error: "Failed to cancel invitation" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),

        {
            name: "invitation-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                myInvitations: state.myInvitations,
                projectInvitations: state.projectInvitations 
            }),
        }
    )
);