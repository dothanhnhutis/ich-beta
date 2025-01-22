import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EnableMFAReq,
  RecoverReq,
  ResetPasswordReq,
  SendReActivateAccountReq,
  SetupMFAReq,
  SignInReq,
  SignInWithMFAReq,
  SignUpReq,
} from "./user.schemas";
import UserService from "./user.services";
import env from "@/shared/configs/env";
import { encrypt } from "@/shared/utils/helper";
import { NotFoundError } from "@/shared/utils/error-handler";

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

  static async signInWithMFA(
    req: Request<{}, {}, SignInWithMFAReq["body"]>,
    res: Response
  ) {
    const session = await UserService.signInWithMFA(req);
    return res
      .status(StatusCodes.OK)
      .cookie(env.SESSION_KEY_NAME, encrypt(session.key), {
        ...session?.data.cookie,
      })
      .json({
        message: "Đăng nhập thành công",
      });
  }

  static async recover(
    req: Request<{}, {}, RecoverReq["body"]>,
    res: Response
  ) {
    const { email } = req.body;
    await UserService.recover(email);

    return res.status(StatusCodes.OK).send({
      message: "Email đổi mật khẩu đã được gửi",
    });
  }
  static async resetPassword(req: Request, res: Response) {
    const token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }
    await UserService.resetPassword(
      token.replace(/^Bearer /, ""),
      req.body.newPassword
    );
    return res.status(StatusCodes.OK).send({
      message: "Đặt lại mật khẩu thành công",
    });
  }

  static async sendReActivateAccount(
    req: Request<{}, {}, SendReActivateAccountReq["body"]>,
    res: Response
  ) {
    const { email } = req.body;
    await UserService.sendReActivateAccount(email);
    return res.status(StatusCodes.OK).send({
      message: "Gửi email thành công",
    });
  }

  static async activeAccount(req: Request, res: Response) {
    const token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }
    await UserService.activeAccount(token.replace(/^Bearer /, ""));
    return res.status(StatusCodes.OK).send({
      message: "Tài khoản đã được kích hoạt",
    });
  }
  static async checkToken(req: Request, res: Response) {
    const token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }
    const data = await UserService.checkToken(token.replace(/^Bearer /, ""));
    return res
      .status(
        data.status == "valid" ? StatusCodes.OK : StatusCodes.UNAUTHORIZED
      )
      .send(data);
  }
  static async signUp(req: Request<{}, {}, SignUpReq["body"]>, res: Response) {
    await UserService.signUp(req.body);
    return res.status(StatusCodes.CREATED).send({
      message:
        "Đăng ký thành công. Một email xác nhận sẽ được gửi đến địa chỉ email của bạn. Làm theo hướng dẫn trong email để xác minh tài khoản.",
    });
  }

  static async confirmEmail(
    req: Request<{}, {}, {}, { token?: string | string[] | undefined }>,
    res: Response
  ) {
    const { token } = req.query;
    if (Array.isArray(token) || typeof token != "string")
      throw new NotFoundError();
    await UserService.confirmEmail(token);
    return res.status(StatusCodes.OK).json({
      message: "Xác thực tài khoản thành công",
    });
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

  static async disactivate(req: Request, res: Response) {
    await UserService.disactivate(req.user!.id);
    res.status(StatusCodes.OK).clearCookie(env.SESSION_KEY_NAME).json({
      message:
        "Tài khoản của bạn đã vô hiệu hóa. Bạn có thể kích hoạt lại bất cứ lúc nào!",
    });
  }

  static async getSessionsOfUser(req: Request, res: Response) {
    const { id } = req.user!;
    const sessions = await UserService.getSessionOfUser(id);
    res.status(StatusCodes.OK).json(sessions);
  }

  static async getCurrentSession(req: Request, res: Response) {
    res.status(StatusCodes.OK).json(req.sessionData);
  }

  static async resendVerifyEmail(req: Request, res: Response) {
    await UserService.resendVerifyEmail(req.user!);

    return res.status(StatusCodes.OK).json({
      message: "Đã gửi lại email xác minh",
    });
  }

  static async createMFA(
    req: Request<{}, {}, SetupMFAReq["body"]>,
    res: Response
  ) {
    const { id } = req.user!;
    const { deviceName } = req.body;
    const data = await UserService.createSetupMFA(id, deviceName);
    res.status(StatusCodes.OK).json({
      message: "Quét mã QR này bằng ứng dụng xác thực của bạn",
      data,
    });
  }

  static async enableMFA(
    req: Request<{}, {}, EnableMFAReq["body"]>,
    res: Response
  ) {
    const { id } = req.user!;
    const { mfa_code1, mfa_code2 } = req.body;
    await UserService.enableMFA(id, { code1: mfa_code1, code2: mfa_code2 });
    res.status(StatusCodes.OK).json({
      message: "Xác thực đa yếu tố (MFA) đã được bật",
    });
  }

  static async disableMFA(req: Request, res: Response) {
    const { id } = req.user!;
    const { mfa_code1, mfa_code2 } = req.body;
    await UserService.disableMFA(id, { code1: mfa_code1, code2: mfa_code2 });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xác thực đa yếu tố (MFA) đã được tắt" });
  }
}
