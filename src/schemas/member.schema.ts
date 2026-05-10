import { z } from "zod";

export const updateMemberSchema = z.object({
  newRole: z.enum(["viewer", "editor"]),
});

export type UpdateMemberFormData = z.infer<typeof updateMemberSchema>;