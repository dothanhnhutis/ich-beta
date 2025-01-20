import { cache } from "@/shared/cache/connect";
import { CacheError } from "@/shared/utils/error-handler";
import { CreateSession, MFA, SessionData, User } from "./user.schemas";
import { randId } from "@/shared/utils/helper";
import env from "@/shared/configs/env";
import { UAParser } from "ua-parser-js";

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
}
