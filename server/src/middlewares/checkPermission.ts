import { RequestHandler as Middleware } from "express";
import { PermissionError } from "@/error-handler";
import { readUserRolesById } from "@/services/user";
import { User } from "@/schemas/user";
import { permissions } from "@/configs/constants";
import { rolesOfUser } from "@/controllers/role";

export async function hasPermission(
  user: User | null,
  permission: (typeof permissions)[number]
) {
  if (!user) return false;
  const roles = await rolesOfUser(user.id);
  return roles.some(({ permissions }) => permissions.includes(permission));
}

export function checkPermission(
  permission: (typeof permissions)[number]
): Middleware {
  return async (req, _, next) => {
    if (!req.user) throw new PermissionError();

    const isValidAccess = await hasPermission(req.user, permission);
    if (!isValidAccess) throw new PermissionError();

    next();
  };
}
