import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(20, "Title must be at most 20 characters long"),
  description: z
    .string()
    .max(3, "Description must be at least 3 characters long"),
  tags: z.string().min(1, "At least one tag is required"),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Priority must be either Low, Medium, or High",
  }),
  dueDate: z.date().nullable().optional(),
});
import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(20, "Title must be at most 20 characters long"),
  description: z
    .string()
    .min(3, "Title must be at least 3 characters long"),
  tags: z.string().min(1, "At least one tag is required"),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Priority must be either Low, Medium, or High",
  }),
});
