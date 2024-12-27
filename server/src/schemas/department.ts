import * as z from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string(),
    factoryId: z.string(),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    departmentId: z.string(),
  }),
  body: z.object({
    name: z.string(),
    factoryId: z.string(),
  }),
});

export type createDepartmentReq = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentReq = z.infer<typeof updateDepartmentSchema>;
export type CreateDepartmentData = {
  name: string;
  factoryId: string;
};
export type UpdateDepartmentData = {
  name: string;
  factoryId: string;
};
export type QueryDepartment = {
  name?: string;
  factoryId?: string;
  orderBy?: {
    column: "name" | "createdAt" | "updatedAt";
    order: "asc" | "desc";
  }[];
  limit?: number;
  page?: number;
};

export type Department = {
  id: string;
  name: string;
  factoryId: string;
  createdAt: Date;
  updatedAt: Date;
};
