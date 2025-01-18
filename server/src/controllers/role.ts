import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import {
  createPermission,
  delRoleCache,
  editRoleCache,
  getPermissionByKeyCache,
  readRoleByIdCache,
  writeRoleCache,
} from "@/redis/role.cache";
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

  const roleIds = await getRoleOfUser(id);

  let rolesCache = (
    await Promise.all(roleIds.map((roleId) => readRoleByIdCache(roleId)))
  ).filter((role) => role != null);

  if (rolesCache.length == roleIds.length)
    return res.status(StatusCodes.OK).json(rolesCache);

  const roleMissedCacheIds = rolesCache
    .map(({ id }) => id)
    .filter((id) => !roleIds.includes(id));

  for (const id of roleMissedCacheIds) {
    const role = await getRoleById(id);
    if (role) {
      writeRoleCache(role);
      rolesCache.push(role);
    }
  }
  return res.status(StatusCodes.OK).json(rolesCache);
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

  const roleCache = await readRoleByIdCache(req.params.roleId);
  if (roleCache) return roleCache;

  const role = await getRoleById(req.params.roleId);
  if (role) await writeRoleCache(role);

  return res.status(StatusCodes.OK).send(role);
}

export async function createRoleHandler(
  req: Request<{}, {}, CreateRoleReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "write:roles");
  if (!isValidAccess) throw new PermissionError();

  const newRole = await createRole(req.body);

  await writeRoleCache(newRole);

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

  const role =
    (await readRoleByIdCache(req.params.roleId)) ||
    (await getRoleById(req.params.roleId));

  if (!role)
    throw new BadRequestError(`Vai trò id=${req.params.roleId} không tồn tại`);
  const newRole = await updateRoleById(req.params.roleId, req.body);

  await editRoleCache(newRole);

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

  await delRoleCache(roleDelete.id);
  return res.status(StatusCodes.OK).json({
    message: "Xoá vai trò thành công",
    role: roleDelete,
  });
}
