// types/invitations.ts
import type { MemberRole } from "./member.type";
import type { User } from "./user.type";


export interface InvitedProject {
  _id: string;
  name: string;
  description?: string;
}


export interface Invitation {
  _id: string;
  project: InvitedProject;
  inviter: User;
  invitee: User;
  inviteeEmail: string;
  role: MemberRole;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type NewInvitation = Pick<Invitation, "inviteeEmail" | "role" > ;
