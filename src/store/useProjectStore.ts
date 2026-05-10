import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../api/axios";
// types
import type { ProjectListResponse, NewProject, Project } from "../types/project.type";
import type { UserRole } from "../types/user.type";
// stores
import { useAuthStore } from "./useAuthStore";
import { useMemberStore } from "./useMemberStore";




interface ProjectState {
    projects: ProjectListResponse;
    userRole: UserRole; 
    isLoading: boolean;
    error: string | null;
    // Actions
    setUserRole: (projectId: string, resourceCreatorId?: string, assignedToId?: string) => void;
    getProjects: () => Promise<void>;
    getProjectById: (id: string) => Project | undefined;
    addProject: (project: NewProject) => void;
    updateProject: (id: string, updatedData: Partial<Project>) => Promise<boolean>;
    deleteProject: (id: string) => Promise<boolean>;

}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: { ownedProjects: [], joinedProjects: [] },
            userRole: "",
            isLoading: false,
            error: null,

            setUserRole: (projectId: string, resourceCreatorId?: string, assignedToId?: string) => {
                const currentUser = useAuthStore.getState().user;
                if (!currentUser) return;

                const project = get().getProjectById(projectId);
                if (!project) return;

                const ownerId = typeof project.owner === 'string' ? project.owner : project.owner?._id;

                if (ownerId === currentUser._id) {
                    set({ userRole: "owner" });
                    return;
                }

                if (resourceCreatorId && resourceCreatorId === currentUser._id) {
                    set({ userRole: "creator" });
                    return;
                }

                if (assignedToId && assignedToId === currentUser._id) {
                    set({ userRole: "assignee" });
                    return;
                }

                const projectMembers = useMemberStore.getState().projectMembers[projectId];
                const member = projectMembers?.list.find((m) => m.user._id === currentUser._id);

                set({ userRole: member?.role || (get().projects.joinedProjects.some(p => p._id === projectId) ? "editor" : "viewer") });
            },

            // fetch all projects for the current user, if there are already projects in state, do not fetch from API
            getProjects: async () => {
                const { ownedProjects, joinedProjects } = get().projects;
                if (ownedProjects.length === 0 && joinedProjects.length === 0) set({ isLoading: true });
                set({ error: null });
                try {
                    const res = await api.get("/projects");
                    set({ projects: res.data.data || res.data });
                } catch (error) {
                    set({ error: "Failed to load projects" });
                    console.error("Get Projects Error:", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            // get a project by id, first check if the project is in ownedProjects or joinedProjects in state, if found return the project, otherwise return undefined
            getProjectById: (id) => {
                const { ownedProjects, joinedProjects } = get().projects;
                return [...ownedProjects, ...joinedProjects].find((p) => p._id === id);
            },

            // add a new project, if successful, add the new project to ownedProjects in state, otherwise set error message in state
            addProject: async (project: NewProject) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await api.post("/projects", project);
                    const newProject = res.data.data || res.data;
                    set((state) => ({
                        projects: {
                            ...state.projects,
                            ownedProjects: [...state.projects.ownedProjects, newProject]
                        }
                    }));
                } catch (error) {
                    set({ error: "Failed to add project" });
                    console.error("Add Project Error:", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            // update a project, if successful, update the project in ownedProjects and joinedProjects in state, otherwise set error message in state
            updateProject: async (id, updatedData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch(`/projects/${id}`, updatedData);
                    const updatedProject = response.data.data || response.data;
                    set((state) => ({
                        projects: {
                            ownedProjects: state.projects.ownedProjects.map((p) =>
                                p._id === id ? { ...p, ...updatedProject } : p
                            ),
                            joinedProjects: state.projects.joinedProjects.map((p) =>
                                p._id === id ? { ...p, ...updatedProject } : p
                            ),
                        }
                    }));
                    return true;
                } catch (err) {
                    set({ error: "Failed to update project" });
                    console.error("Update Project Error:", err);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

            // delete a project, if successful, remove the project from ownedProjects and joinedProjects in state, otherwise set error message in state
            deleteProject: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/projects/${id}`);
                    set((state) => ({
                        projects: {
                            ownedProjects: state.projects.ownedProjects.filter((p) => p._id !== id),
                            joinedProjects: state.projects.joinedProjects.filter((p) => p._id !== id),
                        }
                    }));
                    return true;
                } catch (error) {
                    set({ error: "Failed to delete project" });
                    console.error("Delete Project Error:", error);
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },

        }),
        {
            name: 'project-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                projects: state.projects
            }),
        }
    )
);