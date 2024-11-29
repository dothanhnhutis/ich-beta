import { readMFACache } from "@/redis/mfa.cache";
import prisma from "./db";

export type CreateMFA = {
  secretKey: string;
  userId: string;
};

export type MFA = {
  userId: string;
  secretKey: string;
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

export async function readMFA(
  userId: string,
  cache?: boolean
): Promise<MFA | undefined> {
  if (cache ?? true) {
    const cache = await readMFACache(userId);
    if (cache) return cache;
  }
  const mfa = await prisma.mFA.findUnique({
    where: { userId },
  });
  if (!mfa) return;
  if (cache ?? true) {
    await writeMFA(mfa);
  }
  return mfa;
}

export async function writeMFA(input: CreateMFA): Promise<MFA> {
  const mfa = await prisma.mFA.create({
    data: input,
  });
  return mfa;
}

export async function editMFA(
  userId: string,
  input: Partial<Omit<MFA, "userId">>
) {
  const mfa = await prisma.mFA.update({
    where: { userId },
    data: input,
  });
  return mfa;
}

export async function removeMFA(userId: string): Promise<MFA> {
  const mfa = await prisma.mFA.delete({
    where: {
      userId,
    },
  });
  return mfa;
}
