// types/events.ts

import type { User } from "./user.type";

export interface Event {
    _id: string;
    title: string;
    description: string;
    start: Date | string;
    end: Date | string;
    // project: string; 
    creator: User;
    createdAt?: string;
    updatedAt?: string;
}


export type NewEvent = Omit<Event, "_id" | "createdAt" | "updatedAt" | "creator">;