import { CreatePolicyReq, UpdatePolicyByIdReq } from "@/schemas/policies";
import prisma from "./db";

export async function createPolicyService(input: CreatePolicyReq["body"]) {
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
  const policiesOfUser = await prisma.usersPolicies.findMany({
    where: {
      userId,
    },
    include: {
      policy: true,
    },
  });
  const validPolicy = policiesOfUser.find(
    (p) => p.policy.action == action && p.policy.resource == resource
  );

  if (!validPolicy) return;

  const policy = await prisma.policies.findUnique({
    where: {
      id: validPolicy.policyId,
    },
  });
  if (!policy) return;
  return policy;
}

export async function readPolicyByIdService(policyId: string) {
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

export async function readPoliciesInRangeService(PolicyIds: string[]) {
  return await prisma.policies.findMany({
    where: {
      id: { in: PolicyIds },
    },
  });
}

export async function updatePolicyByIdService(
  policyId: string,
  input: UpdatePolicyByIdReq["body"]
) {
  const data = await prisma.policies.update({
    where: {
      id: policyId,
    },
    data: input,
  });
  return data;
}

export async function deletePolicyByIdService(policyId: string) {
  const data = await prisma.policies.delete({
    where: {
      id: policyId,
    },
  });
  return data;
}
