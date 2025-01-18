import { redisClient } from "@/redis/connection";
import { Role, CreateRoleReq } from "@/schemas/role";

export const getPermissionByKeyCache = async (key: string) => {
  const data = await redisClient.get(`pers:${key}`);
  if (!data) return null;
  const permissions = data.split(",") as CreateRoleReq["body"]["permissions"];
  return permissions;
};

export const createPermission = async (
  key: string,
  permissions: CreateRoleReq["body"]["permissions"]
) => {
  await redisClient.set(`pers:${key}`, permissions.join(","));
};

export const writeRoleCache = async (data: Role) => {
  await redisClient.set(`roles:${data.id}`, JSON.stringify(data));
};

export const readRoleByIdCache = async (roleId: string) => {
  const roleCache = await redisClient.get(`roles:${roleId}`);
  if (!roleCache) return null;
  return JSON.parse(roleCache) as Role;
};

export const editRoleCache = async (newData: Role) => {
  await redisClient.set(`roles:${newData.id}`, JSON.stringify(newData));
};

export const delRoleCache = async (roleId: string) => {
  await redisClient.del(`roles:${roleId}`);
};
