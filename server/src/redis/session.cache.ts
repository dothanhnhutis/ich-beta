import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

import { redisClient } from "@/redis/connection";
import { CookieOptions } from "express";
import env from "@/configs/env";
// import { MFASetup } from "./user.cache";
import { randId } from "@/utils/helper";

// sid:userId:sessionId  =>
export type SessionData = {
  id: string;
  userId: string;
  cookie: CookieOptions;
  reqInfo: {
    ip: string;
    userAgent: UAParser.IResult;
    userAgentRaw: string;
    lastAccess: Date;
    createAt: Date;
  };
};

type WriteSessionCache = {
  userId: string;
  reqInfo: {
    ip: string;
    userAgentRaw: string;
  };
  cookie?: CookieOptions;
};

export async function readSessionCacheByKey(key: string) {
  try {
    const session = await redisClient.get(key);
    if (!session) return;
    return JSON.parse(session) as SessionData;
  } catch (error: unknown) {
    console.log(`readSessionCacheByKey() method error: `, error);
  }
}

export async function readSessionCacheOfUser(userId: string) {
  try {
    const keys = await redisClient.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);
    const data: SessionData[] = [];
    for (const id of keys) {
      const session = await readSessionCacheByKey(id);
      if (!session) continue;
      data.push(session);
    }
    return data;
  } catch (error) {
    console.log(`readSessionCacheOfUser() method error: `, error);
  }
}

export async function writeSessionCache(input: WriteSessionCache) {
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
    await redisClient.set(
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
    console.log(`writeSessionCache() method error: `, error);
  }
}

export async function refreshSessionCache(key: string) {
  try {
    const session = await redisClient.get(key);
    if (!session) return;
    const sessionData: SessionData = JSON.parse(session);
    const now = Date.now();
    const expires: Date = new Date(now + parseInt(env.SESSION_MAX_AGE));
    sessionData.reqInfo.lastAccess = new Date(now);
    sessionData.cookie.expires = expires;
    await redisClient.set(
      key,
      JSON.stringify(sessionData),
      "PX",
      expires.getTime() - Date.now()
    );

    return sessionData;
  } catch (error: unknown) {
    console.log(`refreshSessionCache() method error: `, error);
  }
}

export async function removeSessionBySessionData(sessionData: SessionData) {
  const key = `${env.SESSION_KEY_NAME}:${sessionData.userId}:${sessionData.id}`;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(`removeSessionBySessionData() method error: `, error);
  }
}

export async function removeSessionsOfUser(
  userId: string,
  exceptSessionId?: string[]
) {
  try {
    const keys = await redisClient.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);

    if (keys.length > 0) {
      if (exceptSessionId) {
        const safeSession = exceptSessionId.map(
          (id) => `${env.SESSION_KEY_NAME}:${userId}:${id}`
        );
        await Promise.all(
          keys
            .filter((key) => !safeSession.includes(key))
            .map((key) => redisClient.del(key))
        );
      } else {
        await Promise.all(keys.map((key) => redisClient.del(key)));
      }
    }
  } catch (error) {
    console.log(`removeSessionsOfUser() method error: `, error);
  }
}

// export async function removeSessions(
//   userId: string,
//   exceptSessionId?: string[]
// ) {
//   try {
//     const keys = await redisClient.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);
//     if (!exceptSessionId) {
//       await Promise.all(keys.map(async (key) => redisClient.del(key)));
//     } else {
//       const safeSession = exceptSessionId.map(
//         (id) => `${env.SESSION_KEY_NAME}:${userId}:${id}`
//       );
//       await Promise.all(
//         keys
//           .filter((keys) => !exceptSessionId.includes(keys))
//           .map(async (key) => redisClient.del(key))
//       );
//     }
//   } catch (error) {
//     console.log(`removeSessions() method error: `, error);
//   }
// }
