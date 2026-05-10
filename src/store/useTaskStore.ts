import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Task,  NewTask } from "../types/task.type";
import api from "../api/axios";


interface TaskState {
    tasks: Record<string, Task[]>;
    isLoading: boolean;
    error: null | string;
    // Actions
    getProjectTasks: (projectId: string) => Promise<void>;
    getTaskById: (projectId: string, taskId: string) => Task | undefined;
    addTask: (task: NewTask, projectId: string) => Promise<void>;
    updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<boolean>;
    deleteTask: (projectId: string, taskId: string) => Promise<boolean>;
}


export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: {},
            isLoading: false,
            error: null,

            // get all tasks for a project, if tasks for the project are already in state, do not fetch from API
            getProjectTasks: async (projectId) => {
                const currentTasks = get().tasks[projectId];
                if (currentTasks !== undefined) {
                    return;
                }
                set({ isLoading: true, error: null });
                try {
                    const res = await api.get(`/projects/${projectId}/tasks`);
                    const projectTasks = res.data.data || res.data;

                    set((state) => ({
                        tasks: { ...state.tasks, [projectId]: projectTasks }
                    }));
                } catch (error) {
                    console.error("Error fetching task:", error);
                    set({ error: "Failed to fetch task" });
                }  finally {
                    set({ isLoading: false });
                }
            },

            // get one task by id, if task is not found in state, return undefined
            getTaskById: (projectId, taskId) => {
                const projectTasks = get().tasks[projectId] || [];
                const task = projectTasks.find((t) => t._id === taskId);
                if (!task) {
                    console.warn(`Task with id ${taskId} not found in state.`);
                }
                return task;
            },

            // add a new task to a project, if successful, add the new task to state, otherwise set error message in state
            addTask: async (task, projectId) => {
                set({ isLoading: true });

                try {
                    const res = await api.post(`/projects/${projectId}/tasks`, task);
                    const newTask = res.data.data || res.data;
                    set((state) => ({
                        tasks: {
                            ...state.tasks,
                            [projectId]: [...(state.tasks[projectId] || []), newTask]
                        },
                        isLoading: false,
                    }));   
                } catch (error) {
                    console.error("Error adding task:", error);
                    set({ error: "Failed to add task" });
                }  finally {
                    set({ isLoading: false });
                }
            },

            // update a task, if successful, update the task in state, otherwise set error message in state
            updateTask: async (projectId, taskId, updates) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await api.patch(`/projects/${projectId}/tasks/${taskId}`, updates);
                    const updatedTask = res.data.data || res.data;

                    set((state) => ({
                        tasks: {
                            ...state.tasks,
                            [projectId]: state.tasks[projectId].map((t) => 
                                t._id === taskId ? { ...t, ...updatedTask } : t
                            )
                        },
                        isLoading: false,
                }));
                    return true;
                } catch (error) {
                    console.error("Error updating task:", error);
                    set({ error: "Failed to update task" });
                    return false;
                }  finally {
                    set({ isLoading: false });
                }
            },

            // delete a task, if successful, remove the task from state, otherwise set error message in state
            deleteTask: async (projectId, taskId) => {
                set({ isLoading: true, error: null });
                try {
                    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
                    set((state) => ({
                        tasks: {
                            ...state.tasks,
                            [projectId]: state.tasks[projectId].filter((t) => t._id !== taskId)
                        }
                    }));
                    return true;
                } catch (error) {
                    console.error("Error deleting task:", error);
                    set({ error: "Failed to delete task" });
                    return false;
                }  finally {
                    set({ isLoading: false });
                }
            }
            
        }),

        {
            name: 'task-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ tasks: state.tasks }),
        }
    )
);


