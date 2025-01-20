import {
  readUserCacheByEmail,
  readUserCacheById,
  readUserTokenCache,
  writeUserCache,
} from "@/redis/user.cache";
import prisma from "./db";
import { User, UserAttributeFilterProps, UserToken } from "@/schemas/user";
import { Prisma } from "@prisma/client";
import { hashData } from "@/utils/helper";

const userAttributeFilter = (user: UserAttributeFilterProps): User => {
  const {
    emailVerificationExpires,
    emailVerificationToken,
    passwordResetExpires,
    passwordResetToken,
    reActiveExpires,
    reActiveToken,
    ...props
  } = user;

  return props;
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
  });

  if (user) {
    const afterUser = userAttributeFilter(user);

    if (cache ?? true) {
      await writeUserCache(afterUser);
    }
    return afterUser;
  }
  return user;
}

export async function readUserById(id: string, cache?: boolean) {
  if (cache ?? true) {
    const userCache = await readUserCacheById(id);
    if (userCache) return userCache;
  }
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    const afterUser = userAttributeFilter(user);

    if (cache ?? true) {
      await writeUserCache(afterUser);
    }
    return afterUser;
  }
  return user;
}

export async function readUserByToken(token: UserToken, cache?: boolean) {
  let user = null;

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
      });
      break;

    case "recover":
      user = await prisma.users.findUnique({
        where: {
          passwordResetToken: token.session,
          passwordResetExpires: { gte: new Date() },
        },
      });
      break;

    case "reActivate":
      user = await prisma.users.findUnique({
        where: {
          reActiveToken: token.session,
          reActiveExpires: { gte: new Date() },
        },
      });
      break;
  }

  if (user) {
    const afterUser = userAttributeFilter(user);

    if (cache ?? true) {
      await writeUserCache(afterUser);
    }
    return afterUser;
  }
  return user;
}

export async function readUserRolesById(userId: string) {
  const usersRoles = await prisma.usersRoles.findMany({
    where: {
      userId,
    },
    include: {
      role: true,
    },
  });

  if (usersRoles.length == 0) return [];
  return usersRoles.map(({ role }) => role);
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
  });

  const afterUser = userAttributeFilter(user);

  if (storeCache ?? true) {
    await writeUserCache(afterUser);
  }
  return afterUser;
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
  roleIds: string[];
};

export async function editUserById(
  userId: string,
  input: Partial<EditUser>,
  storeCache?: boolean
) {
  const { roleIds, ...props } = input;
  const data: Prisma.UsersUpdateInput = {
    ...props,
  };

  if (input.password) {
    data.password = await hashData(input.password);
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data,
  });

  if (roleIds) {
    const userRoles = await prisma.usersRoles.findMany({
      where: {
        userId,
      },
    });
    const oldRoles = userRoles.map(({ roleId }) => roleId);
    const createList = roleIds
      .filter((id) => !oldRoles.includes(id))
      .map((id) => ({
        roleId: id,
        userId,
      }));
    const deleteList = oldRoles.filter((id) => !roleIds.includes(id));
    const createUsersRoles = prisma.usersRoles.createMany({
      data: createList,
    });

    const deleteUsersRoles = prisma.usersRoles.deleteMany({
      where: {
        userId,
        roleId: { in: deleteList },
      },
    });

    await Promise.all([createUsersRoles, deleteUsersRoles]);
  }

  if (user) {
    const afterUser = userAttributeFilter(user);

    if (storeCache ?? true) {
      await writeUserCache(afterUser);
    }
    return afterUser;
  }
  return user;
}
