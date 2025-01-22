import { cache } from "@/shared/cache/connect";
import { CacheError } from "@/shared/utils/error-handler";
import {
  CreateSession,
  MFA,
  SessionData,
  User,
  UserToken,
} from "./user.schemas";
import { randId } from "@/shared/utils/helper";
import env from "@/shared/configs/env";
import { UAParser } from "ua-parser-js";
import { generateMFA, TOTPAuth } from "@/shared/utils/mfa";

export default class UserCache {
  static async getUserByEmail(email: string) {
    try {
      const id = await cache.get(`user:email:${email}`);
      if (!id) return null;
      const user = await cache.get(`user:${id}`);
      if (!user) return null;
      return JSON.parse(user) as User;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`findUserByEmail() method error: `, error);
        throw new CacheError(
          `findUserByEmail() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getUserCacheById(id: string) {
    try {
      const user = await cache.get(`users:${id}`);
      return user == null ? null : (JSON.parse(user) as User);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`getUserCacheById() method error: `, error);
        throw new CacheError(
          `getUserCacheById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createUser(user: User) {
    try {
      await cache.set(`user:${user.id}`, JSON.stringify(user));
      await cache.set(`user:email:${user.email}`, user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createUserCache() method error: `, error);
        throw new CacheError(
          `createUserCache() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createSession(input: CreateSession) {
    const sessionId = await randId();
    const now = new Date();

    const cookieOpt = {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV == "production",
      expires: new Date(now.getTime() + parseInt(env.SESSION_MAX_AGE)),
      ...input.cookie,
    };
    const sessionData: SessionData = {
      id: sessionId,
      userId: input.userId,
      cookie: cookieOpt,
      reqInfo: {
        ...input.reqInfo,
        userAgent: UAParser(input.reqInfo.userAgentRaw),
        lastAccess: now,
        createAt: now,
      },
    };
    const key = `${env.SESSION_KEY_NAME}:${input.userId}:${sessionId}`;
    try {
      await cache.set(
        key,
        JSON.stringify(sessionData),
        "PX",
        cookieOpt.expires.getTime() - Date.now()
      );

      return {
        key,
        data: sessionData,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createSession() method error: `, error);
        throw new CacheError(`createSession() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteSessionsOfUser(
    userId: string,
    exceptSessionId?: string[]
  ) {
    try {
      const keys = await cache.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);

      if (keys.length > 0) {
        if (exceptSessionId) {
          const safeSession = exceptSessionId.map(
            (id) => `${env.SESSION_KEY_NAME}:${userId}:${id}`
          );
          await Promise.all(
            keys
              .filter((key) => !safeSession.includes(key))
              .map((key) => cache.del(key))
          );
        } else {
          await Promise.all(keys.map((key) => cache.del(key)));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`deleteSessionsOfUser() method error: `, error);
        throw new CacheError(
          `deleteSessionsOfUser() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getSessionByKey(key: string) {
    try {
      const session = await cache.get(key);
      if (!session) return null;
      return JSON.parse(session) as SessionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`getMFA() method error: `, error);
        throw new CacheError(`getMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async getSessionsOfUser(userId: string) {
    try {
      const keys = await cache.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);
      const data: SessionData[] = [];
      for (const id of keys) {
        const session = await UserCache.getSessionByKey(id);
        if (!session) continue;
        data.push(session);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`getSessionsOfUser() method error: `, error);
        throw new CacheError(
          `getSessionsOfUser() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createUserToken(
    token: UserToken & { userId: string; expires: Date }
  ) {
    try {
      let tokenKey: string | null = null;
      if (token.type == "email-verification") {
        tokenKey = `user:token:email-verification:${token.session}`;
      } else if (token.type == "account-recovery") {
        tokenKey = `user:token:account-recovery:${token.session}`;
      } else if (token.type == "reactivate-account") {
        tokenKey = `user:token:reactivate-account:${token.session}`;
      }

      if (tokenKey)
        await cache.set(
          `user:token:verify-email:${token.session}`,
          token.userId,
          "PX",
          token.expires.getTime() - Date.now()
        );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createUserToken() method error: `, error);
        throw new CacheError(
          `createUserToken() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async refreshSession(key: string) {
    try {
      const session = await cache.get(key);
      if (!session) return null;
      const sessionData: SessionData = JSON.parse(session);
      const now = Date.now();
      const expires: Date = new Date(now + parseInt(env.SESSION_MAX_AGE));
      sessionData.reqInfo.lastAccess = new Date(now);
      sessionData.cookie.expires = expires;
      await cache.set(
        key,
        JSON.stringify(sessionData),
        "PX",
        expires.getTime() - Date.now()
      );

      return sessionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`refreshSession() method error: `, error);
        throw new CacheError(`refreshSession() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteSession(userId: string, sessionId: string) {
    const key = `${env.SESSION_KEY_NAME}:${userId}:${sessionId}`;
    try {
      await cache.del(key);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`deleteSession() method error: `, error);
        throw new CacheError(`deleteSession() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async getMFA(userId: string) {
    try {
      const data = await cache.get(`mfa:${userId}`);
      if (!data) return null;
      return JSON.parse(data) as MFA;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`getMFA() method error: `, error);
        throw new CacheError(`getMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async createMFA(data: MFA) {
    try {
      await cache.set(`mfa:${data.userId}`, JSON.stringify(data));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createMFA() method error: `, error);
        throw new CacheError(`createMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async updateMFA(mfa: MFA) {
    try {
      const oldMFA = await UserCache.getMFA(mfa.userId);
      await cache.set(
        `mfa:${mfa.userId}`,
        JSON.stringify({ ...oldMFA, ...mfa })
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`updateMFA() method error: `, error);
        throw new CacheError(`updateMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteMFA(userId: string) {
    try {
      await cache.del(`mfa:${userId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`deleteMFA() method error: `, error);
        throw new CacheError(`deleteMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async createMFASession(
    sessionId: string,
    input: {
      userId: string;
      secretKey: string;
    }
  ) {
    try {
      await cache.set(
        `mfa:session:${sessionId}`,
        JSON.stringify(input),
        "EX",
        30 * 60 * 1000
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createMFASession() method error: `, error);
        throw new CacheError(
          `createMFASession() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getMFASession(sessionId: string) {
    try {
      const sessionCache = await cache.get(`mfa:session:${sessionId}`);
      if (!sessionCache) return null;
      return JSON.parse(sessionCache) as {
        userId: string;
        secretKey: string;
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`getMFASession() method error: `, error);
        throw new CacheError(`getMFASession() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteMFASession(sessionId: string) {
    try {
      await cache.del(`mfa:session:${sessionId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`deleteMFASession() method error: `, error);
        throw new CacheError(
          `deleteMFASession() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getSetupMFA(userId: string) {
    try {
      const existMFASetup = await cache.get(`mfa:${userId}:setup`);
      if (!existMFASetup) return;
      return JSON.parse(existMFASetup) as TOTPAuth;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`readSetupMFA() method error: `, error);
        throw new CacheError(`readSetupMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }
  static async createSetupMFA(userId: string, deviceName: string) {
    try {
      const existMFASetup = await cache.get(`mfa:${userId}:setup`);
      if (existMFASetup) {
        return JSON.parse(existMFASetup) as TOTPAuth;
      } else {
        const totp = generateMFA(deviceName);
        await cache.set(
          `mfa:${userId}:setup`,
          JSON.stringify(totp),
          "EX",
          30 * 60
        );
        return totp;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`createSetupMFA() method error: `, error);
        throw new CacheError(`createSetupMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteSetupMFA(userId: string) {
    try {
      await cache.del(`mfa:${userId}:setup`);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`deleteSetupMFA() method error: `, error);
        throw new CacheError(`deleteSetupMFA() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async getUserByToken(token: UserToken) {
    try {
      let userIdCache: string | null = null;
      if (token.type == "email-verification") {
        userIdCache = await cache.get(
          `user:token:email-verification:${token.session}`
        );
      } else if (token.type == "account-recovery") {
        userIdCache = await cache.get(
          `user:token:account-recovery:${token.session}`
        );
      } else if (token.type == "reactivate-account") {
        userIdCache = await cache.get(
          `user:token:reactivate-account:${token.session}`
        );
      }
      if (!userIdCache) return null;
      const userCache = await cache.get(`users:${userIdCache}`);
      return userCache ? (JSON.parse(userCache) as User) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`getUserByToken() method error: `, error);
        throw new CacheError(`getUserByToken() method error: ${error.message}`);
      }
      throw error;
    }
  }

  static async deleteUserToken(token: UserToken) {
    try {
      if (token.type == "email-verification") {
        await cache.del(`user:token:email-verification:${token.session}`);
      } else if (token.type == "account-recovery") {
        await cache.del(`user:token:account-recovery:${token.session}`);
      } else if (token.type == "reactivate-account") {
        await cache.del(`user:token:reactivate-account:${token.session}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`deleteUserToken() method error: `, error);
        throw new CacheError(
          `deleteUserToken() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
