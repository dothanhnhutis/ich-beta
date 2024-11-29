import * as z from "zod";

const subTask = z.object({
  name: z.string(),
  status: z.enum(["ACCEPTED", "REJECTED", "ASSIGNED"]),
});

export const createTaskSchema = z.object({
  body: z
    .object({
      title: z.string(),
      subTitle: z.string(),
      startDate: z.string().datetime(),
      dueDate: z.string().datetime(),
      priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
      status: z.enum(["TO_DO", "ON_PROGRESS", "IN_REVIEW", "COMPLETED"]),
      subTasks: z.array(subTask).default([]),
      tags: z.array(z.string()).default([]),
    })
    .strict(),
});

export type CreateTaskReq = z.infer<typeof createTaskSchema>;
