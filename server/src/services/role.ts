import { CreateRoleData, UpdateRoleData } from "@/schemas/role";
import prisma from "./db";

export async function getRoleById(roleId: string) {
  return await prisma.roles.findUnique({
    where: {
      id: roleId,
    },
  });
}

export async function getRoles() {
  return await prisma.roles.findMany({});
}

export async function createRole(data: CreateRoleData) {
  return await prisma.roles.create({
    data,
  });
}

export async function updateRoleById(roleId: string, data: UpdateRoleData) {
  return await prisma.roles.update({
    where: {
      id: roleId,
    },
    data,
  });
}

export async function deleteRoleById(roleId: string) {
  return await prisma.roles.delete({
    where: {
      id: roleId,
    },
  });
}
