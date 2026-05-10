import { z } from "zod";

export const noteSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be less than 100 characters"),

    content: z
        .string()
        .min(3, "Content must be at least 3 characters")
        .max(2000, "Content must be less than 2000 characters"),

    assignedTo: z.string().nullable().optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;