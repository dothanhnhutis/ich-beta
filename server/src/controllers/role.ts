import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { getPermissionByKeyCache } from "@/redis/role.cache";
import { CreateRoleReq, UpdateRoleReq } from "@/schemas/role";
import {
  createRole,
  deleteRoleById,
  getRoleById,
  getRoleOfUser,
  getRoles,
  updateRoleById,
} from "@/services/role";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getRoleOfUserHandler(req: Request, res: Response) {
  const { id } = req.user!;

  const roles = await getRoleOfUser(id);

  let keys: string = roles
    .map(({ id }) => id)
    .sort()
    .join(",");
  const pers = await getPermissionByKeyCache(keys);
  if (pers) return pers;
}

export async function getRolesHandler(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user, "read:roles");
  if (!isValidAccess) throw new PermissionError();
  const roles = await getRoles();
  return res.status(StatusCodes.OK).send(roles);
}

export async function getRoleByIdHandler(
  req: Request<{ roleId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:roles");
  if (!isValidAccess) throw new PermissionError();
  const role = await getRoleById(req.params.roleId);
  return res.status(StatusCodes.OK).send(role);
}

export async function createRoleHandler(
  req: Request<{}, {}, CreateRoleReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "write:roles");
  if (!isValidAccess) throw new PermissionError();

  const newRole = await createRole(req.body);
  return res.status(StatusCodes.CREATED).json({
    message: "Tạo vai trò thành công",
    role: newRole,
  });
}

export async function updateRoleByIdHandler(
  req: Request<UpdateRoleReq["params"], {}, UpdateRoleReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "update:roles");
  if (!isValidAccess) throw new PermissionError();

  const role = await getRoleById(req.params.roleId);
  if (!role)
    throw new BadRequestError(`Vai trò id=${req.params.roleId} không tồn tại`);
  const newRole = await updateRoleById(req.params.roleId, req.body);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật vai trò thành công",
    role: newRole,
  });
}

export async function deleteRoleByIdHandler(
  req: Request<{ roleId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "delete:roles");
  if (!isValidAccess) throw new PermissionError();
  const role = await getRoleById(req.params.roleId);
  if (!role)
    throw new BadRequestError(`Vai trò id=${req.params.roleId} không tồn tại`);

  const roleDelete = await deleteRoleById(req.params.roleId);
  return res.status(StatusCodes.OK).json({
    message: "Xoá vai trò thành công",
    role: roleDelete,
  });
}
