import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SignInReq } from "./user.schemas";
import UserService from "./user.services";
import env from "@/shared/configs/env";
import { encrypt } from "@/shared/utils/helper";
import UserCache from "./user.cache";

export default class UserController {
  static async signIn(req: Request<{}, {}, SignInReq["body"]>, res: Response) {
    const session = await UserService.signIn(req);
    if ("key" in session) {
      return res
        .status(StatusCodes.OK)
        .cookie(env.SESSION_KEY_NAME, encrypt(session.key), {
          ...session.data.cookie,
        })
        .json({
          message: "Đăng nhập thành công",
        });
    } else {
      res.status(StatusCodes.OK).json({
        message: "Cần xác thực đa yếu tố (MFA)",
        session: session.sessionId,
      });
    }
  }

  static async currentUser(req: Request, res: Response) {
    const { password, ...noPass } = req.user!;
    return res
      .status(StatusCodes.OK)
      .json({ ...noPass, hasPassword: !!password });
  }

  static async signOut(req: Request, res: Response) {
    if (req.sessionData)
      await UserService.signOut(req.sessionData.userId, req.sessionData.id);
    res
      .status(StatusCodes.OK)
      .clearCookie(env.SESSION_KEY_NAME)
      .json({
        message: "Đăng xuất thành công",
      })
      .end();
  }
}
