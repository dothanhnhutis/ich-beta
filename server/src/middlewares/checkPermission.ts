import { RequestHandler as Middleware } from "express";
import { PermissionError } from "@/error-handler";
import { readUserRolesById } from "@/services/user";
import { User } from "@/schemas/user";
import { permissions } from "@/configs/constants";

export function hasPermission(user: User | null, permission: string) {
  if (!user) return false;
  return user.roles.some(({ permissions }) => permissions.includes(permission));
}

export function checkPermission(
  permission: (typeof permissions)[number]
): Middleware {
  return async (req, _, next) => {
    if (!req.user) throw new PermissionError();

    const isValidAccess = hasPermission(req.user, permission);
    if (!isValidAccess) throw new PermissionError();

    next();
  };
}
