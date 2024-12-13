import {
  readUserCacheByEmail,
  readUserTokenCache,
  writeUserCache,
} from "@/redis/user.cache";
import prisma from "./db";
import { User, UserToken } from "@/schemas/user";
import { Prisma } from "@prisma/client";
import { hashData } from "@/utils/helper";

const userSelectDefault = {
  id: true,
  email: true,
  emailVerified: true,
  status: true,
  password: true,
  username: true,
  gender: true,
  picture: true,
  phoneNumber: true,
  birthDate: true,
  createdAt: true,
  updatedAt: true,
};

export async function readUserByEmail(email: string, cache?: boolean) {
  if (cache ?? true) {
    const userCache = await readUserCacheByEmail(email);
    if (userCache) return userCache;
  }
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    select: userSelectDefault,
  });
  if (!user) return;
  if (cache ?? true) {
    await writeUserCache(user);
  }
  return user;
}

export async function readUserById(id: string) {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
    select: userSelectDefault,
  });
  if (!user) return;
  return user;
}

export async function readUserByToken(token: UserToken, cache?: boolean) {
  let user: User | null = null;

  if (cache ?? true) {
    const userCache = await readUserTokenCache(token);
    if (userCache) return userCache;
  }
  switch (token.type) {
    case "emailVerification":
      user = await prisma.users.findUnique({
        where: {
          emailVerificationToken: token.session,
          emailVerificationExpires: { gte: new Date() },
        },
        select: userSelectDefault,
      });
      break;

    case "recover":
      user = await prisma.users.findUnique({
        where: {
          passwordResetToken: token.session,
          passwordResetExpires: { gte: new Date() },
        },
        select: userSelectDefault,
      });
      break;

    case "reActivate":
      user = await prisma.users.findUnique({
        where: {
          reActiveToken: token.session,
          reActiveExpires: { gte: new Date() },
        },
        select: userSelectDefault,
      });
      break;
  }

  if (!user) return;

  return user;
}

type WriteUserWithPassword = {
  username: string;
  email: string;
  password: string;
  emailVerificationExpires: Date;
  emailVerificationToken: string;
  status?: User["status"];
  gender?: User["gender"];
  picture?: string;
  phoneNumber?: string;
  birthDate?: string;
};

export async function writeUserWithPassword(
  input: WriteUserWithPassword,
  storeCache?: boolean
) {
  const data: Prisma.UsersCreateInput = {
    ...input,
  };

  const user = await prisma.users.create({
    data,
    select: userSelectDefault,
  });

  if (storeCache ?? true) {
    await writeUserCache(user);
  }

  return user;
}

type EditUser = {
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  reActiveExpires: Date | null;
  reActiveToken: string | null;
  status: User["status"];
  username: string;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  picture: string;
  birthDate: string;
  phoneNumber: string;
};

export async function editUserById(
  userId: string,
  input: Partial<EditUser>,
  storeCache?: boolean
) {
  const data: Prisma.UsersUpdateInput = {
    ...input,
  };

  if (input.password) {
    data.password = await hashData(input.password);
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data,
    select: userSelectDefault,
  });

  if (storeCache ?? true) {
    await writeUserCache(user);
  }
  return user;
}

export async function updateUserPoliciesByIdService(
  userId: string,
  policyIds: string[]
) {
  await prisma.usersPolicies.deleteMany({
    where: {
      userId,
      policyId: { notIn: policyIds },
    },
  });

  await prisma.usersPolicies.createMany({
    data: policyIds.map((policyId) => ({
      userId,
      policyId,
    })),
    skipDuplicates: true,
  });
}
