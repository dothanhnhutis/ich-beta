import { readUserCacheByEmail, readUserCacheById } from "@/redis/user.cache";
import { User } from "@/schemas/user";
import { readUserById } from "@/services/user";
import { RequestHandler as Middleware } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

const deserializeUser: Middleware = async (req, res, next) => {
  if (!req.sessionData) return next();
  req.user =
    (await readUserCacheById(req.sessionData.userId)) ||
    (await readUserById(req.sessionData.userId));
  next();
};
export default deserializeUser;
