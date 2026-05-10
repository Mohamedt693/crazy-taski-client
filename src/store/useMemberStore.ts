import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useProjectStore } from "./useProjectStore"; 

import type { ProjectMembersData, ProjectMember } from "../types/member.type";
import api from "../api/axios";


interface MemberState {
    projectMembers: Record<string, ProjectMembersData>;
    isLoading: boolean;
    error: string | null;
    // Actions
    getProjectMembers: (projectId: string) => Promise<void>;
    getMemberById: (projectId: string, memberId: string) => ProjectMember | undefined;
    updateMemberRole: (projectId: string, memberId: string, newRole: string) => Promise<boolean>;
    removeMember: (projectId: string, memberId: string) => Promise<boolean>;
    leaveProject: (projectId: string) => Promise<boolean>;
}


export const useMemberStore = create<MemberState>()(
    persist(
        (set, get) => ({
            projectMembers: {},
            isLoading: false,
            error: null,

            // fetch all members for a project, if there are already members for the project in state, do not fetch from API
            getProjectMembers: async (projectId) => {
                const currentMembers = get().projectMembers[projectId];
                if (currentMembers !== undefined) {
                    return;
                }
                set({ isLoading: true, error: null });
                try {
                    const res = await api.get(`/projects/${projectId}/members`);
                    const data = res.data.data || res.data; 

                    set((state) => ({
                        projectMembers: { 
                            ...state.projectMembers, 
                            [projectId]: {
                                list: data.members || [], 
                                owner: data.owner || null
                            } 
                        }
                    }));
                } catch (error) {
                    console.error("Fetch Members Error:", error);
                    set({ error: "Failed to fetch members" });
                } finally {
                    set({ isLoading: false });
                }
            },

            // get a member by their ID from the list of members for a project in state, if the member is not found, return undefined
            getMemberById: (projectId, memberId) => {
                return get().projectMembers[projectId]?.list.find((m) => m._id === memberId);
            },

            // update a member's role in a project, if successful, update the member's role in state, otherwise set error message in state
            updateMemberRole: async (projectId: string, memberId: string, newRole: string) => {
                console.log("Updating member role:", { projectId, memberId, newRole });
                set({ isLoading: true, error: null });
                try {
                    await api.patch(`/projects/${projectId}/members/role`, {
                        userId: memberId,
                        newRole: newRole,
                    });

                    set((state) => {
                        const project = state.projectMembers[projectId];
                        if (!project) return state;

                        const updatedList = project.list.map((m) =>
                            m.user._id === memberId 
                                ? { ...m, role: newRole as "editor" | "viewer" } 
                                : m
                        );

                        return {
                            projectMembers: {
                                ...state.projectMembers,
                                [projectId]: {
                                    ...project,
                                    list: updatedList,
                                },
                            },
                        };
                    });
                    return true;
                } catch (error) {
                    console.error("Update Role Error:", error);
                    set({ error: "Failed to update member role" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // remove a member from a project, if successful, remove the member from state, otherwise set error message in state
            removeMember: async (projectId, memberId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/projects/${projectId}/members/${memberId}`);
                    
                    set((state) => {
                        const project = state.projectMembers[projectId];
                        if (!project) return state;

                        return {
                            projectMembers: {
                                ...state.projectMembers,
                                [projectId]: {
                                    ...project,
                                    list: project.list.filter((m) => m._id !== memberId)
                                }
                            }
                        };
                    });
                    return true;
                } catch (error) {
                    console.error("Remove Member Error:", error);
                    set({ error: "Failed to remove member" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // leave a project, if successful, remove the member from joinedProjects in project store and remove the member from state, otherwise set error message in state
            leaveProject: async (projectId) => {
                set({ isLoading: true });
                try {
                    await api.delete(`/projects/${projectId}/members/leave`);

                    useProjectStore.setState((state) => ({
                        projects: {
                            ...state.projects,
                            joinedProjects: state.projects.joinedProjects.filter(p => p._id !== projectId)
                        }
                    }));

                    set((state) => {
                        const newProjectMembers = { ...state.projectMembers };
                        delete newProjectMembers[projectId];
                        return { projectMembers: newProjectMembers };
                    });

                    return true;
                } catch (error) {
                    console.error("Leave Project Error:", error);
                    set({ error: "Failed to leave project" });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            }
        }),

        {
            name: "member-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                projectMembers: state.projectMembers 
            }),
        }
    )
);