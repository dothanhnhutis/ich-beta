import * as z from "zod";
import { Department } from "./department";
import { User, validDataSchema } from "./user";

export const createDisplaySchema = z.object({
  body: z
    .object({
      content: z.string({
        required_error: "content is required",
        invalid_type_error: "content must be string",
      }),
      enable: z
        .boolean({
          required_error: "enable is required",
          invalid_type_error: "enable must be boolean",
        })
        .default(true),
      priority: z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be interger",
        })
        .min(0, "priority minimun 0")
        .max(100, "priority maximun 100")
        .default(0),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "departmentIds item must be string",
          }),
          {
            required_error: "departmentIds is required",
            invalid_type_error: "departmentIds must be array string",
          }
        )
        .nonempty("departmentIds can not empty"),
    })
    .strict(),
});

export const updateDisplayByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      content: z.string({
        required_error: "content is required",
        invalid_type_error: "content must be string",
      }),
      enable: z
        .boolean({
          required_error: "enable is required",
          invalid_type_error: "enable must be boolean",
        })
        .default(true),
      priority: z
        .number({
          required_error: "priority is required",
          invalid_type_error: "priority must be interger",
        })
        .min(0, "priority minimun 0")
        .max(100, "priority maximun 100")
        .default(0),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "departmentIds item must be string",
          }),
          {
            required_error: "departmentIds is required",
            invalid_type_error: "departmentIds must be array string",
          }
        )
        .nonempty("departmentIds can not empty"),
    })
    .strip()
    .partial(),
});

export type CreateDisplayReq = z.infer<typeof createDisplaySchema>;
export type UpdateDisplayByIdReq = z.infer<typeof updateDisplayByIdSchema>;
export type Display = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  departments: Department[];
};

export type DisplayAttributeFilter = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  departmentsDisplays: {
    department: Department;
  }[];
  createdBy: Pick<User, "id" | "email" | "username" | "picture">;
};

export type QueryDisplay = {
  enable?: boolean;
  priority?: [number, number] | number;
  createdAt?: [string, string];
  departmentIds?: string[];
  userIds?: string[];
  orderBy?: {
    column: "priority" | "enable" | "createdAt" | "updatedAt";
    order: "asc" | "desc";
  }[];
  limit?: number;
  page?: number;
};
