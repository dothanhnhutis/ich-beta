import prisma from "@/shared/db/connect";
import UserCache from "./user.cache";
import { MFA, User, UserAttributeFilterProps } from "./user.schemas";

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
}
