// types/members.ts

import type { User } from "./user.type";

export type MemberRole = "editor" | "viewer";

export interface ProjectMember {
  _id: string;
  role: MemberRole; 
  user: User;
  joinedAt: string;
}

export interface ProjectMembersData {
  list: ProjectMember[];
  owner: User | null;
}

