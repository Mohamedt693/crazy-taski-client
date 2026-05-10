// types/tasks.ts

import type { User } from "./user.type";

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    creator: User;
    assignedTo?: 
    string |
    {
    _id: string;
    displayName: string;
    avatar?: string;
    } 
    | null;
    project: string;
    createdAt: string;
}


export type NewTask = Omit<Task, "_id" | "createdAt" | "creator">;
