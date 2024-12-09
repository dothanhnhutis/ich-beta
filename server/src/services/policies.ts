import { CreatePolicy } from "@/schemas/policies";
import prisma from "./db";

export async function createPolicyService(input: CreatePolicy["body"]) {
  const policy = await prisma.policies.create({
    data: input,
  });

  return policy;
}

export async function readPoliciesByUserIdService(
  userId: string,
  action: string,
  resource: string
) {
  const policyOfUser = await prisma.usersPolicies.findFirst({
    where: {
      userId,
      policy: {
        action,
        resource,
      },
    },
    select: {
      policyId: true,
    },
  });

  if (!policyOfUser) return;

  const policy = await prisma.policies.findUnique({
    where: {
      id: policyOfUser.policyId,
    },
  });
  if (!policy) return;
  return policy;
}

export async function readRoleByIdService(policyId: string) {
  const policy = await prisma.policies.findUnique({
    where: {
      id: policyId,
    },
  });
  if (!policy) return;
  return policy;
}

export async function readPoliciesService() {
  return await prisma.policies.findMany();
}
