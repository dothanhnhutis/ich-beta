import { Request } from "express";
import { BadRequestError } from "@/shared/utils/error-handler";
import { SignInReq, SignUpReq, User, UserToken } from "./user.schemas";
import UserReposities from "./user.repositories";
import { compareData, hashData } from "@/shared/utils/password";
import { randId } from "@/shared/utils/helper";
import UserCache from "./user.cache";
import env from "@/shared/configs/env";
import { signJWT, verifyJWT } from "@/shared/utils/token";
import { emaiEnum } from "@/shared/utils/nodemailer";
import UserMessageBroker from "@/shared/message-broker/user";
import { generateQRCode } from "@/shared/utils/qrcode";

export default class UserService {
  static async signIn(req: Request<{}, {}, SignInReq["body"]>) {
    const { email, password } = req.body;
    const user = await UserReposities.getUserByEmail(email);

    if (
      !user ||
      !user.password ||
      !(await compareData(user.password, password))
    )
      throw new BadRequestError("Email và mật khẩu không hợp lệ.");

    if (user.status == "SUSPENDED")
      throw new BadRequestError(
        "Tài khoản của bạn đã tạm vô hiệu hoá. Vui lòng kích hoạt lại trước khi đăng nhập"
      );

    if (user.status == "DISABLED")
      throw new BadRequestError("Tài khoản của bạn đã vô hiệu hoá vĩnh viễn");

    const mfa = await UserReposities.getMFa(user.id);
    if (mfa) {
      const sessionId = await randId();
      await UserCache.createMFASession(sessionId, {
        secretKey: mfa.secretKey,
        userId: user.id,
      });
      return { sessionId };
    } else {
      const session = await UserCache.createSession({
        userId: user.id,
        reqInfo: {
          ip: req.ip || "",
          userAgentRaw: req.headers["user-agent"] || "",
        },
      });

      return session;
    }
  }

  static async signUp(data: SignUpReq["body"]) {
    const { email, password, username } = data;
    const user = await UserReposities.getUserByEmail(email);
    if (user) throw new BadRequestError("Email đã được đăng ký.");

    const session = await randId();
    const expires: number = Math.floor(
      (Date.now() + 4 * 60 * 60 * 1000) / 1000
    );
    const newUser = await UserReposities.createUserWithPassword({
      email,
      password: await hashData(password),
      username,
      emailVerificationToken: session,
      emailVerificationExpires: new Date(expires * 1000),
    });

    const token = signJWT(
      {
        type: "email-verification",
        session: session,
        exp: expires,
      },
      env.JWT_SECRET
    );

    await Promise.all([
      UserCache.createUserToken({
        type: "email-verification",
        userId: newUser.id,
        expires: new Date(expires * 1000),
        session,
      }),
      UserMessageBroker.sendEmailVerificationProducer({
        template: emaiEnum.EMAIL_VERIFICATION,
        receiver: email,
        locals: {
          username: username,
          verificationLink: env.CLIENT_URL + "/confirm-email?token=" + token,
        },
      }),
    ]);
  }

  static async confirmEmail(token: string) {
    const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);
    if (!tokenVerify || tokenVerify.type != "email-verification")
      throw new BadRequestError("Phiên của bạn đã hết hạn.");

    const user = await UserReposities.getUserByToken(tokenVerify);
    if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

    await Promise.all([
      UserReposities.updateUserById(user.id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: new Date(),
      }),
      UserCache.deleteUserToken(tokenVerify),
    ]);
  }

  static async signOut(userId: string, sessionId: string) {
    await UserCache.deleteSession(userId, sessionId);
  }

  static async getSessionOfUser(userId: string) {
    return UserCache.getSessionsOfUser(userId);
  }

  static async resendVerifyEmail(user: User) {
    const { username, email, emailVerified, id } = user;
    if (emailVerified) throw new BadRequestError("Tài khoản đã xác thực");

    const session = await randId();
    const expires: number = Math.floor(
      (Date.now() + 4 * 60 * 60 * 1000) / 1000
    );
    const token = signJWT(
      {
        type: "email-verification",
        session: session,
        exp: expires,
      },
      env.JWT_SECRET
    );

    await Promise.all([
      UserReposities.updateUserById(id, {
        emailVerificationToken: session,
        emailVerificationExpires: new Date(expires * 1000),
      }),
      UserCache.createUserToken({
        type: "email-verification",
        userId: id,
        expires: new Date(expires * 1000),
        session,
      }),
      UserMessageBroker.sendEmailVerificationProducer({
        template: emaiEnum.EMAIL_VERIFICATION,
        receiver: email,
        locals: {
          username: username,
          verificationLink: env.CLIENT_URL + "/confirm-email?token=" + token,
        },
      }),
    ]);
  }

  static async createSetupMFA(useId: string, deviceName: string) {
    const mfa = await UserReposities.getMFa(useId);
    if (mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");
    const generateMFA = await UserCache.createSetupMFA(useId, deviceName);
    const imageUrl = await generateQRCode(generateMFA.oauth_url);
    return {
      qr: imageUrl,
      mfa: generateMFA,
    };
  }
}
