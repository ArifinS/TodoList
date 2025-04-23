import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(20, "Title must be at most 20 characters long"),
  description: z
    .string()
    .min(3, "Title must be at least 3 characters long"),
  tags: z.string().min(1, "At least one tag is required")
  .max(10, "tag must be at most 20 characters long"),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Priority must be either Low, Medium, or High",
  }),
});

export type TaskFormData = z.infer<typeof taskSchema>;