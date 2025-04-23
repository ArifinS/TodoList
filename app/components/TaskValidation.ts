import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters long"),
  description: z.string().min(1, "Description is required").min(5, "Description must be at least 5 characters long"),
  tags: z.string().min(1, "At least one tag is required"),
  priority: z.enum(["Medium", "High"], { message: "Priority must be either Medium or High" }),
});

export type TaskFormData = z.infer<typeof taskSchema>;