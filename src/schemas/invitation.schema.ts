import { z } from "zod";

export const inviteMemberSchema = z.object({
    inviteeEmail: z.email("Please enter a valid email address"),
    
    role: z.enum(["viewer", "editor"]),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;