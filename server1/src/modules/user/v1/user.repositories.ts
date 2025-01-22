import prisma from "@/shared/db/connect";
import UserCache from "./user.cache";
import {
  CreateMFA,
  CreateUserWithPassword,
  MFA,
  UpdateUser,
  User,
  UserAttributeFilterProps,
  UserToken,
} from "./user.schemas";
import { hashData } from "@/shared/utils/password";

function userPublicAttr(user: UserAttributeFilterProps): User {
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
}

export default class UserReposities {
  static async getUserByEmail(email: string, cache?: boolean) {
    if (cache ?? true) {
      const userCache = await UserCache.getUserByEmail(email);
      if (userCache) return userCache;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const afterUser = userPublicAttr(user);
      if (cache ?? true) {
        await UserCache.createUser(afterUser);
      }
      return afterUser;
    }
    return user;
  }

  static async getUserById(id: string, cache?: boolean) {
    if (cache ?? true) {
      const userCache = await UserCache.getUserCacheById(id);
      if (userCache) return userCache;
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      const afterUser = userPublicAttr(user);

      if (cache ?? true) {
        await UserCache.createUser(afterUser);
      }
      return afterUser;
    }
    return user;
  }

  static async getUserByToken(token: UserToken, cache?: boolean) {
    if (cache ?? true) {
      const user = await UserCache.getUserByToken(token);
      if (user) return user;
    }
    let user: UserAttributeFilterProps | null = null;
    if (token.type == "email-verification") {
      user = await prisma.user.findUnique({
        where: {
          emailVerificationToken: token.session,
          emailVerificationExpires: { gte: new Date() },
        },
      });
    } else if (token.type == "account-recovery") {
      user = await prisma.user.findUnique({
        where: {
          passwordResetToken: token.session,
          passwordResetExpires: { gte: new Date() },
        },
      });
    } else if (token.type == "reactivate-account") {
      user = await prisma.user.findUnique({
        where: {
          reActiveToken: token.session,
          reActiveExpires: { gte: new Date() },
        },
      });
    }
    if (!user) return null;
    const userPub = userPublicAttr(user);
    if (user) {
      if (cache ?? true) {
        await UserCache.createUser(userPub);
      }
    }
    return userPub;
  }

  static async getMFa(userId: string, cache?: boolean): Promise<MFA | null> {
    if (cache ?? true) {
      const cache = await UserCache.getMFA(userId);
      if (cache) return cache;
    }
    const mfa = await prisma.mFA.findUnique({
      where: { userId },
    });
    if (!mfa) return null;
    if (cache ?? true) {
      await UserCache.createMFA(mfa);
    }
    return mfa;
  }

  static async createMFA(data: CreateMFA, storeCache?: boolean) {
    const mfa = await prisma.mFA.create({
      data,
    });
    if (storeCache ?? true) {
      await UserCache.createMFA(mfa);
    }
    return mfa;
  }

  static async updateMFA(
    userId: string,
    data: Partial<Pick<MFA, "secretKey" | "lastAccess">>,
    updateCache?: boolean
  ) {
    const mfa = await prisma.mFA.update({
      where: { userId },
      data,
    });

    if (updateCache || true) {
      UserCache.updateMFA(mfa);
    }
  }

  static async deleteMFA(userId: string, removeCache?: boolean): Promise<MFA> {
    const mfa = await prisma.mFA.delete({
      where: {
        userId,
      },
    });

    if (removeCache ?? true) {
      await UserCache.deleteMFA(userId);
    }

    return mfa;
  }

  static async updateUserById(
    userId: string,
    data: UpdateUser,
    storeCache?: boolean
  ) {
    const { roleIds, ...props } = data;
    if (data.password) {
      data.password = await hashData(data.password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...props,
      },
    });
    if (roleIds) {
      const userRoles = await prisma.userRole.findMany({
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
      const createUsersRoles = prisma.userRole.createMany({
        data: createList,
      });

      const deleteUsersRoles = prisma.userRole.deleteMany({
        where: {
          userId,
          roleId: { in: deleteList },
        },
      });

      await Promise.all([createUsersRoles, deleteUsersRoles]);
    }
    const userPublic = userPublicAttr(user);
    if (storeCache ?? true) {
      await UserCache.createUser(userPublic);
    }
    return userPublic;
  }

  static async createUserWithPassword(
    data: CreateUserWithPassword,
    storeCache?: boolean
  ) {
    const user = await prisma.user.create({
      data,
    });
    const userPub = userPublicAttr(user);
    if (storeCache ?? true) {
      await UserCache.createUser(userPub);
    }
    return userPub;
  }
}
