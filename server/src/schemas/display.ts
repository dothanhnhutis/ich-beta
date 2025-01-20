import * as z from "zod";
import { Department } from "./department";
import { User } from "./user";

export const createDisplaySchema = z.object({
  body: z
    .object({
      content: z.string({
        required_error: "Nội dung hiển thị không được trống",
        invalid_type_error: "Nội dung hiển thị là chuỗi",
      }),
      enable: z
        .boolean({
          required_error: "Bật tắt hiển thị không được trống",
          invalid_type_error: "Bật tắt hiển thị là true/false",
        })
        .default(true),
      priority: z
        .number({
          required_error: "Ưu tiên không được trống",
          invalid_type_error: "Ưu tiên là số nguyên",
        })
        .min(0, "Ưu tiên là số nguyên lớn hơn hoặc bằng 0")
        .max(99, "Ưu tiên là số nguyên nhỏ hơn hoặc bằng 99")
        .default(0),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "Mã phòng là chuỗi",
          }),
          {
            required_error: "Phòng ban không được trống",
            invalid_type_error: "Phòng ban là mảng chuỗi",
          }
        )
        .nonempty("Phòng ban không được bỏ trống"),
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
        invalid_type_error: "Nội dung hiển thị là chuỗi",
      }),
      enable: z
        .boolean({
          invalid_type_error: "Bật tắt hiển thị là true/false",
        })
        .default(true),
      priority: z
        .number({
          invalid_type_error: "Ưu tiên là số nguyên",
        })
        .min(0, "Ưu tiên là số nguyên lớn hơn hoặc bằng 0")
        .max(99, "Ưu tiên là số nguyên nhỏ hơn hoặc bằng 99")
        .default(0),
      departmentIds: z
        .array(
          z.string({
            invalid_type_error: "Mã phòng là chuỗi",
          }),
          {
            invalid_type_error: "Phòng ban là mảng chuỗi",
          }
        )
        .nonempty("Phòng ban không được bỏ trống"),
    })
    .strip()
    .partial(),
});

export type CreateDisplayReq = z.infer<typeof createDisplaySchema>;
export type UpdateDisplayByIdReq = z.infer<typeof updateDisplayByIdSchema>;

export type CreateDisplayData = CreateDisplayReq["body"] & {
  userId: string;
};

export type EditDisplayData = UpdateDisplayByIdReq["body"];

export type Display = {
  id: string;
  content: string;
  enable: boolean;
  priority: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  departments: Department[];
  createdBy: Pick<User, "id" | "email" | "username" | "picture">;
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

export type SearchDisplay = {
  enable?: boolean;
  priority?: [number, number] | number;
  createdAt?: [string, string];
  departmentId?: string[];
  userIds?: string[];
  orderBy?: {
    column: "priority" | "enable" | "createdAt" | "updatedAt";
    order: "asc" | "desc";
  }[];
  limit?: number;
  page?: number;
};
