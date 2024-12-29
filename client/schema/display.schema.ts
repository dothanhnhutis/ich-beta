import * as z from "zod";
import { Department } from "./department.schema";

export const createDisplaySchema = z
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
      .min(1, "departmentIds not empty"),
  })
  .strict();
export const updateDisplaySchema = z
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
      .min(1, "departmentIds not empty"),
  })
  .strip();
export type CreateDisplay = z.infer<typeof createDisplaySchema>;
export type UpdateDisplay = z.infer<typeof updateDisplaySchema>;

export type Display = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  departments: Department[];
  createdBy: {
    id: string;
    picture: string;
    username: string;
    email: string;
  };
};
