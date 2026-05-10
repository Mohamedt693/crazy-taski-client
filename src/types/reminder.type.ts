// types/reminders.ts

import type { User } from "./user.type";

export interface Reminder {
    _id: string;
    title: string;
    remindAt: Date | string;
    status: "pending" | "sent" | "cancelled";
    // project: string;
    creator: User; 
    createdAt?: string;
    updatedAt?: string;
}


export type NewReminder = Omit<Reminder, "_id" | "createdAt" | "updatedAt" | "creator">;