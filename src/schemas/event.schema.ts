import { z } from "zod";

// schemas/event.schema.ts

export const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),

    description: z.string().min(0),

    start: z.string().min(1, "Start date is required"),
    end: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.end) > new Date(data.start), {
    message: "End time must be after start time",
    path: ["end"],
});

export type EventFormData = z.infer<typeof eventSchema>;