import { RequestHandler as Middleware } from "express";
import env from "@/configs/env";

import { decrypt, encrypt } from "@/utils/helper";
import {
  readSessionCacheByKey,
  refreshSessionCache,
  SessionData,
} from "@/redis/session.cache";

declare global {
  namespace Express {
    interface Request {
      sessionData?: SessionData | undefined;
    }
  }
}

const deserializeCookie: Middleware = async (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) return next();

  const cookiesParser = cookies
    .split("; ")
    .reduce<Record<string, string>>((prev, curr, idx, array) => {
      const data = curr.split("=");
      prev[data[0]] = data[1];
      return prev;
    }, {});

  if (!cookiesParser[env.SESSION_KEY_NAME]) return next();
  const sessionKey = decrypt(cookiesParser[env.SESSION_KEY_NAME]);

  if (!sessionKey) {
    res.clearCookie(env.SESSION_KEY_NAME);
    return next();
  }

  req.sessionData = await readSessionCacheByKey(sessionKey);
  if (!req.sessionData) {
    res.clearCookie(env.SESSION_KEY_NAME);
    req.sessionData = undefined;
    return next();
  }
  const newSession = await refreshSessionCache(sessionKey);
  if (!newSession) {
    res.clearCookie(env.SESSION_KEY_NAME);
    req.sessionData = undefined;
    return next();
  }
  res.cookie(env.SESSION_KEY_NAME, encrypt(sessionKey), newSession.cookie);

  return next();
};
export default deserializeCookie;
