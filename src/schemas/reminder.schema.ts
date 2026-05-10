import { z } from "zod";

export const reminderSchema = z.object({
    title: z
        .string()
        .min(2, "Title is too short")
        .max(100, "Title is too long")
        .trim(),

    remindAt: z.string().min(1, "Date is required"),

    status: z.enum(["pending", "sent", "cancelled"]),
});

export type ReminderFormData = z.infer<typeof reminderSchema>;