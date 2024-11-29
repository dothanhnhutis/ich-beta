import * as z from "zod";

const subTask = z.object({
  name: z.string(),
  status: z.enum(["ACCEPTED", "REJECTED", "ASSIGNED"]),
});

const createTaskSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  startDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  priority: z.enum(["LOW", "NORMAL", "URGENT"]),
  progress: z.enum(["TO_DO", "ON_PROGRESS", "IN_REVIEW", "COMPLETED"]),
  subTasks: z.array(subTask),
  tags: z.array(z.string()),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
