// types/project.ts

import type { User } from "./user.type";


export interface ProjectSettings {
    canMembersInvite: boolean;
}


export interface Project {
    _id: string;
    name: string;
    description?: string;
    owner: User;
    settings: ProjectSettings;
    createdAt: string;
    updatedAt: string;
}


export interface ProjectListResponse {
    ownedProjects: Project[];
    joinedProjects: Project[];
}

export type NewProject = Pick<Project, "name" | "description" | "settings">;