import { permissions } from "@/configs/constants";
import * as z from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Tên vai trò là bất buộc",
      invalid_type_error: "Tên vai trò là chuỗi",
    }),
    permissions: z.array(z.enum(permissions)).transform((v) => {
      return v.filter((value, idx, array) => array.indexOf(value) === idx);
    }),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    roleId: z.string(),
  }),
  body: z.object({
    name: z.string({
      required_error: "Tên vai trò là bất buộc",
      invalid_type_error: "Tên vai trò là chuỗi",
    }),
    permissions: z.array(z.enum(permissions)).transform((v) => {
      return v.filter((value, idx, array) => array.indexOf(value) === idx);
    }),
  }),
});

export type CreateRoleReq = z.infer<typeof createRoleSchema>;
export type UpdateRoleReq = z.infer<typeof updateRoleSchema>;

export type CreateRoleData = {
  name: string;
  permissions: string[];
};

export type UpdateRoleData = CreateRoleData;

export type Role = CreateRoleData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
