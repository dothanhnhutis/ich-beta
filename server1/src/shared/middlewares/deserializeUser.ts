import UserReposities from "@/modules/user/v1/user.repositories";
import { User } from "@/modules/user/v1/user.schemas";
import { RequestHandler as Middleware } from "express";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

const deserializeUser: Middleware = async (req, res, next) => {
  if (!req.sessionData) return next();
  req.user = await UserReposities.getUserById(req.sessionData.userId);
  next();
};
export default deserializeUser;
