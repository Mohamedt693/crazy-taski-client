import { z } from "zod";

export const projectSchema = z.object({
    name: z
        .string()
        .min(3, "Project name is too short")
        .max(50, "Project name cannot exceed 50 characters")
        .trim(),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    settings: z.object({
        canMembersInvite: z.boolean(),
        isPublic: z.boolean(),
    }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;