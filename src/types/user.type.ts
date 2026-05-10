// types/user.ts

export interface User {
    _id: string;
    displayName: string;
    email: string;
    avatar: string;
}

export type UserRole = "owner" | "creator" | "editor" | "assignee" | "viewer" | "";