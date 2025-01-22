import { Request } from "express";
import { BadRequestError } from "@/shared/utils/error-handler";
import {
  SignInReq,
  SignInWithMFAReq,
  SignUpReq,
  User,
  UserToken,
} from "./user.schemas";
import UserReposities from "./user.repositories";
import { compareData, hashData } from "@/shared/utils/password";
import { randId } from "@/shared/utils/helper";
import UserCache from "./user.cache";
import env from "@/shared/configs/env";
import { signJWT, verifyJWT } from "@/shared/utils/token";
import { emaiEnum } from "@/shared/utils/nodemailer";
import UserMessageBroker from "@/shared/message-broker/user";
import { generateQRCode } from "@/shared/utils/qrcode";
import { validateMFA } from "@/shared/utils/mfa";

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

  static async signInWithMFA(req: Request<{}, {}, SignInWithMFAReq["body"]>) {
    const { sessionId, code } = req.body;
    const mfaSession = await UserCache.getMFASession(sessionId);
    console.log(sessionId, mfaSession);
    if (!mfaSession) throw new BadRequestError("Phiên đã hêt hạn");

    const validMFA =
      validateMFA({
        secret: mfaSession.secretKey,
        token: code,
      }) == 0;

    if (!validMFA) throw new BadRequestError("Mã xác thực không hợp lệ");

    await Promise.all([
      UserReposities.updateMFA(mfaSession.userId, {
        lastAccess: new Date(),
      }),
      UserCache.deleteMFASession(sessionId),
    ]);

    return await UserCache.createSession({
      userId: mfaSession.userId,
      reqInfo: {
        ip: req.ip || "",
        userAgentRaw: req.headers["user-agent"] || "",
      },
    });
  }

  static async recover(email: string) {
    const user = await UserReposities.getUserByEmail(email);
    if (!user) throw new BadRequestError("Email không tồn tại");

    const session = await randId();
    const expires: number = Math.floor(
      (Date.now() + 4 * 60 * 60 * 1000) / 1000
    );

    const token = signJWT(
      {
        type: "account-recovery",
        session: session,
        exp: expires,
      },
      env.JWT_SECRET
    );
    const recoverLink = `${env.CLIENT_URL}/reset-password?token=${token}`;

    await Promise.all([
      UserReposities.updateUserById(user.id, {
        passwordResetToken: session,
        passwordResetExpires: new Date(expires * 1000),
      }),
      UserCache.createUserToken({
        type: "account-recovery",
        session,
        userId: user.id,
        expires: new Date(expires * 1000),
      }),

      UserMessageBroker.sendEmailProducer({
        template: emaiEnum.ACCOUNT_RECOVERY,
        receiver: user.email,
        locals: {
          username: user.username,
          recoverLink,
        },
      }),
    ]);
  }

  static async resetPassword(token: string, newPassword: string) {
    const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);

    if (!tokenVerify || tokenVerify.type != "account-recovery")
      throw new BadRequestError("Phiên của bạn đã hết hạn.");

    const user = await UserReposities.getUserByToken(tokenVerify);
    if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

    await Promise.all([
      UserReposities.updateUserById(user.id, {
        password: await hashData(newPassword),
        passwordResetExpires: new Date(),
        passwordResetToken: null,
      }),
      UserCache.deleteUserToken(tokenVerify),
    ]);
  }

  static async sendReActivateAccount(email: string) {
    const user = await UserReposities.getUserByEmail(email);

    if (!user) throw new BadRequestError("Email không tồn tại");
    if (user.status == "ACTIVE")
      throw new BadRequestError("Tài khoản của bạn đang hoạt động");
    if (user.status == "DISABLED")
      throw new BadRequestError(
        "Tài khoản của bạn đã bị vô hiệu hoá vĩnh viễn"
      );

    const session = await randId();
    const expires: number = Math.floor(
      (Date.now() + 4 * 60 * 60 * 1000) / 1000
    );

    const token = signJWT(
      {
        type: "reactivate-account",
        session,
        exp: expires,
      },
      env.JWT_SECRET
    );
    const reactivateLink = `${env.CLIENT_URL}/reactivate?token=${token}`;

    await Promise.all([
      UserReposities.updateUserById(user.id, {
        reActiveToken: session,
        reActiveExpires: new Date(expires * 1000),
      }),
      UserCache.createUserToken({
        type: "reactivate-account",
        userId: user.id,
        expires: new Date(expires * 1000),
        session,
      }),
      UserMessageBroker.sendEmailProducer({
        template: emaiEnum.REACTIVATE_ACCOUNT,
        receiver: user.email,
        locals: {
          username: user.username,
          reactivateLink,
        },
      }),
    ]);
  }

  static async activeAccount(token: string) {
    const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);
    if (!tokenVerify || tokenVerify.type != "reactivate-account")
      throw new BadRequestError("Phiên của bạn đã hết hạn");

    const user = await UserReposities.getUserByToken(tokenVerify);
    if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn");
    await Promise.all([
      UserReposities.updateUserById(user.id, {
        status: "ACTIVE",
        reActiveExpires: new Date(),
        reActiveToken: null,
      }),
      UserCache.deleteUserToken(tokenVerify),
    ]);
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
      UserMessageBroker.sendEmailProducer({
        template: emaiEnum.EMAIL_VERIFICATION,
        receiver: email,
        locals: {
          username: username,
          verificationLink: env.CLIENT_URL + "/confirm-email?token=" + token,
        },
      }),
    ]);
  }

  static async checkToken(token: string): Promise<{
    status: "expired" | "revoked" | "valid" | "invalid";
    expiresAt: string | null;
    userId: string | null;
  }> {
    const tokenVerify = verifyJWT<UserToken & { exp: number; iat: number }>(
      token,
      env.JWT_SECRET
    );
    if (!tokenVerify)
      return {
        status: "invalid",
        expiresAt: null,
        userId: null,
      };
    const user = await UserReposities.getUserByToken(tokenVerify);
    if (!user) {
      const expires = new Date(tokenVerify.exp * 1000);
      if (expires.getTime() >= Date.now()) {
        return {
          status: "revoked",
          expiresAt: new Date(tokenVerify.exp * 1000).toISOString(),
          userId: null,
        };
      }
      return {
        status: "expired",
        expiresAt: new Date(tokenVerify.exp * 1000).toISOString(),
        userId: null,
      };
    }

    return {
      status: "valid",
      expiresAt: new Date(tokenVerify.exp * 1000).toISOString(),
      userId: user.id,
    };
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

  static async disactivate(userId: string) {
    await Promise.all([
      UserReposities.updateUserById(userId, {
        status: "SUSPENDED",
      }),
      UserCache.deleteSessionsOfUser(userId),
    ]);
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
      UserMessageBroker.sendEmailProducer({
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

  static async enableMFA(
    userId: string,
    mfa: { code1: string; code2: string }
  ) {
    const userHasMFA = await UserReposities.getMFa(userId);
    if (userHasMFA)
      throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");
    const totpData = await UserCache.getSetupMFA(userId);
    if (!totpData)
      throw new BadRequestError("Phiên xác thực đa yếu tố (MFA) đã hết hạn");
    if (
      validateMFA({ secret: totpData.base32, token: mfa.code1 }) == null ||
      validateMFA({ secret: totpData.base32, token: mfa.code2 }) == null
    )
      throw new BadRequestError(
        "Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn"
      );

    await Promise.all([
      UserReposities.createMFA({
        userId,
        secretKey: totpData.base32,
      }),
      UserCache.deleteSetupMFA(userId),
    ]);
  }

  static async disableMFA(
    userId: string,
    mfa: { code1: string; code2: string }
  ) {
    const userHasMFA = await UserReposities.getMFa(userId);
    if (!userHasMFA)
      throw new BadRequestError("Xác thực đa yếu tố (MFA) chưa được bật");
    if (
      validateMFA({ secret: userHasMFA.secretKey, token: mfa.code1 }) == null ||
      validateMFA({ secret: userHasMFA.secretKey, token: mfa.code2 }) == null
    )
      throw new BadRequestError(
        "Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn"
      );

    await UserReposities.deleteMFA(userId);
  }
}
