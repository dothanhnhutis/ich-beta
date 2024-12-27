import prisma from "./db";

export async function readRoleById(roleId: string) {
  return await prisma.roles.findUnique({
    where: {
      id: roleId,
    },
  });
}
