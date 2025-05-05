// TaskValidation.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(10, "Title must be at most 10 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description must be at most 100 characters long"), // Adjusted max for practicality
  tags: z.string().min(1, "At least one tag is required"),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Priority must be either Low, Medium, or High",
  }),
  dueDate: z.date().nullable().optional(), // Made optional to match form behavior
});