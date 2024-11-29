import * as z from "zod";

const subTask = z.object({
  title: z.string(),
  status: z.enum(["ACCEPTED", "REJECTED", "ASSIGNED"]).default("ASSIGNED"),
});

export const createTaskSchema = z.object({
  body: z
    .object({
      planId: z.string({
        required_error: "username là trường bắt buộc",
        invalid_type_error: "username phải là chuỗi",
      }),
      title: z.string({
        required_error: "username là trường bắt buộc",
        invalid_type_error: "username phải là chuỗi",
      }),
      subTitle: z.string({
        required_error: "username là trường bắt buộc",
        invalid_type_error: "username phải là chuỗi",
      }),
      // startDate: z.string().datetime(),
      // dueDate: z.string().datetime(),
      priority: z.enum(["LOW", "NORMAL", "URGENT"]),
      progress: z.enum(["TO_DO", "ON_PROGRESS", "IN_REVIEW", "COMPLETED"]),
      subTasks: z
        .array(subTask, {
          required_error: "username là trường bắt buộc",
          invalid_type_error: "username phải là chuỗi",
        })
        .default([]),
      // tags: z.array(z.string()).default([]),
    })
    .strict(),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      plansId: z.string(),
      title: z.string(),
      subTitle: z.string(),
      // startDate: z.string().datetime(),
      // dueDate: z.string().datetime(),
      priority: z.enum(["LOW", "NORMAL", "URGENT"]),
      progress: z.enum(["TO_DO", "ON_PROGRESS", "IN_REVIEW", "COMPLETED"]),
      // subTasks: z.array(subTask).default([]),
      // tags: z.array(z.string()).default([]),
    })
    .strip()
    .partial(),
});

export type CreateTaskReq = z.infer<typeof createTaskSchema>;
export type UpdateTaskReq = z.infer<typeof updateTaskSchema>;
