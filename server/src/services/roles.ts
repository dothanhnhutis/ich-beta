import { CreateRole } from "@/schemas/roles";
import prisma from "./db";

export async function writerRole(input: CreateRole["body"]) {
  const { name, policies } = input;
  let newRole;
  if (policies.length > 0) {
    newRole = await prisma.roles.create({
      data: {
        name,
        policies: {
          create: policies,
        },
      },
    });
  } else {
    newRole = await prisma.roles.create({
      data: {
        name,
      },
    });
  }

  return newRole;
}
