import { redisClient } from "@/redis/connection";
import { CreateRoleReq } from "@/schemas/role";

export const getPermissionByKeyCache = async (key: string) => {
  const data = await redisClient.get(key);
  if (!data) return null;
  const permissions = data.split(",") as CreateRoleReq["body"]["permissions"];

  return permissions;
};
