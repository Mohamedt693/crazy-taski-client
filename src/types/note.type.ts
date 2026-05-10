// types/notes.ts

import type { User } from "./user.type";

export interface Note {
    _id: string;
    title: string;
    content: string;
    // project: string;
    creator: User;
    assignedTo?: 
    string |
    {
    _id: string;
    displayName: string;
    avatar?: string;
    } 
    | null;
    dueDate?: string;
    createdAt?: string;
}

export type NewNote = Omit<Note, "_id" | "createdAt" | "creator">;