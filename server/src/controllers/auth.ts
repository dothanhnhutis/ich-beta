import env from "@/configs/env";
import { BadRequestError, NotFoundError } from "@/error-handler";
import { sendEmailProducer } from "@/rabbitmq/mail";
import {
  readMFASessionCache,
  removeMFASessionCache,
  writeMFACache,
  writeMFASessionCache,
} from "@/redis/mfa.cache";
import { writeSessionCache } from "@/redis/session.cache";
import {
  readUserTokenCache,
  removeUserTokenCache,
  writeUserTokenCache,
} from "@/redis/user.cache";
import {
  RecoverReq,
  ResetPasswordReq,
  SendReActivateAccountReq,
  SignInReq,
  SignInWithMFAReq,
  SignUpReq,
} from "@/schemas/auth";
import { UserToken } from "@/schemas/user";
import { editMFA, readMFA } from "@/services/mfa";
import {
  editUserById,
  readUserByEmail,
  readUserByToken,
  writeUserWithPassword,
} from "@/services/user";
import {
  compareData,
  encrypt,
  hashData,
  randId,
  signJWT,
  verifyJWT,
} from "@/utils/helper";
import { validateMFA } from "@/utils/mfa";
import { emaiEnum } from "@/utils/nodemailer";
import { generateQRCode } from "@/utils/qrcode";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function signUp(
  req: Request<{}, {}, SignUpReq["body"]>,
  res: Response
) {
  const { email, password, username } = req.body;
  const user = await readUserByEmail(email);
  if (user) throw new BadRequestError("Email đã được đăng ký.");

  const session = await randId();
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);
  const newUser = await writeUserWithPassword({
    email,
    password: await hashData(password),
    username,
    emailVerificationToken: session,
    emailVerificationExpires: new Date(expires * 1000),
  });

  const token = signJWT(
    {
      type: "emailVerification",
      session: session,
      exp: expires,
    },
    env.JWT_SECRET
  );

  await Promise.all([
    writeUserTokenCache({
      type: "emailVerification",
      userId: newUser.id,
      expires: new Date(expires * 1000),
      session,
    }),
    sendEmailProducer({
      template: emaiEnum.VERIFY_EMAIL,
      receiver: email,
      locals: {
        username: username,
        verificationLink: env.CLIENT_URL + "/confirm-email?token=" + token,
      },
    }),
  ]);

  return res.status(StatusCodes.CREATED).send({
    message:
      "Đăng ký thành công. Một email xác nhận sẽ được gửi đến địa chỉ email của bạn. Làm theo hướng dẫn trong email để xác minh tài khoản.",
  });
}

export async function signIn(
  req: Request<{}, {}, SignInReq["body"]>,
  res: Response
) {
  const { email, password } = req.body;
  const user = await readUserByEmail(email);

  if (!user || !user.password || !(await compareData(user.password, password)))
    throw new BadRequestError("Email và mật khẩu không hợp lệ.");

  if (user.status == "SUSPENDED")
    throw new BadRequestError(
      "Tài khoản của bạn đã tạm vô hiệu hoá. Vui lòng kích hoạt lại trước khi đăng nhập"
    );

  if (user.status == "DISABLED")
    throw new BadRequestError("Tài khoản của bạn đã vô hiệu hoá vĩnh viễn");

  const mfa = await readMFA(user.id);

  if (mfa) {
    const sessionId = await randId();
    await writeMFASessionCache(sessionId, {
      secretKey: mfa.secretKey,
      userId: user.id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Cần xác thực đa yếu tố (MFA)",
      session: sessionId,
    });
  } else {
    console.log("signin", req.body.email);

    const newSession = await writeSessionCache({
      userId: user.id,
      reqInfo: {
        ip: req.ip || "",
        userAgentRaw: req.headers["user-agent"] || "",
      },
    });

    if (!newSession) throw new BadRequestError("Tạo session thất bại.");
    console.log("newSession", newSession);
    return res
      .status(StatusCodes.OK)
      .cookie(env.SESSION_KEY_NAME, encrypt(newSession.key), {
        ...newSession.data.cookie,
      })
      .json({
        message: "Đăng nhập thành công",
      });
  }
}

export async function signInWithMFA(
  req: Request<{}, {}, SignInWithMFAReq["body"]>,
  res: Response
) {
  const { sessionId, code } = req.body;
  const mfaSession = await readMFASessionCache(sessionId);
  if (!mfaSession) throw new BadRequestError("Phiên đã hêt hạn");

  const validMFA =
    validateMFA({
      secret: mfaSession.secretKey,
      token: code,
    }) == 0;

  if (!validMFA) throw new BadRequestError("Mã xác thực không hợp lệ");

  const sessionData = await editMFA(mfaSession.userId, {
    lastAccess: new Date(),
  });

  await removeMFASessionCache(sessionId);
  await writeMFACache(sessionData);

  const newSession = await writeSessionCache({
    userId: mfaSession.userId,
    reqInfo: {
      ip: req.ip || "",
      userAgentRaw: req.headers["user-agent"] || "",
    },
  });

  if (!newSession) throw new BadRequestError("Mã xác thực không hợp lệ");

  return res
    .status(StatusCodes.OK)
    .cookie(env.SESSION_KEY_NAME, encrypt(newSession.key), {
      ...newSession?.data.cookie,
    })
    .json({
      message: "Đăng nhập thành công",
    });
}

export async function recover(
  req: Request<{}, {}, RecoverReq["body"]>,
  res: Response
) {
  const { email } = req.body;
  const user = await readUserByEmail(email);
  if (!user) throw new BadRequestError("Email không tồn tại");

  const session = await randId();
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);

  const token = signJWT(
    {
      type: "recover",
      session: session,
      exp: expires,
    },
    env.JWT_SECRET
  );
  const recoverLink = `${env.CLIENT_URL}/reset-password?token=${token}`;

  await Promise.all([
    editUserById(user.id, {
      passwordResetToken: session,
      passwordResetExpires: new Date(expires * 1000),
    }),
    writeUserTokenCache({
      type: "recover",
      session,
      userId: user.id,
      expires: new Date(expires * 1000),
    }),
    sendEmailProducer({
      template: emaiEnum.RECOVER_ACCOUNT,
      receiver: user.email,
      locals: {
        username: user.username,
        recoverLink,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Email đổi mật khẩu đã được gửi",
  });
}

export async function confirmEmail(
  req: Request<{}, {}, {}, { token?: string | string[] | undefined }>,
  res: Response
) {
  const { token } = req.query;
  if (Array.isArray(token) || typeof token != "string")
    throw new NotFoundError();
  const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);
  if (!tokenVerify || tokenVerify.type != "emailVerification")
    throw new BadRequestError("Phiên của bạn đã hết hạn.");

  const user = await readUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  await Promise.all([
    editUserById(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: new Date(),
    }),
    removeUserTokenCache(tokenVerify),
  ]);
  return res.status(StatusCodes.OK).json({
    message: "Xác thực tài khoản thành công",
  });
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordReq["body"], ResetPasswordReq["query"]>,
  res: Response
) {
  const { token } = req.query;
  if (typeof token != "string") throw new NotFoundError();

  const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);

  if (!tokenVerify || tokenVerify.type != "recover")
    throw new BadRequestError("Phiên của bạn đã hết hạn.");

  const { newPassword } = req.body;

  const user = await readUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  await Promise.all([
    editUserById(user.id, {
      password: await hashData(newPassword),
      passwordResetExpires: new Date(),
      passwordResetToken: null,
    }),
    removeUserTokenCache(tokenVerify),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Đặt lại mật khẩu thành công",
  });
}

export async function getToken(
  req: Request<{}, {}, {}, Partial<{ token: string | string[] | undefined }>>,
  res: Response
) {
  const { token } = req.query;
  if (Array.isArray(token) || typeof token == "undefined")
    throw new NotFoundError();
  const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);
  if (!tokenVerify) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  const user = await readUserByToken(tokenVerify);
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn.");

  return res.status(StatusCodes.OK).send(user);
}

export async function sendReActivateAccount(
  req: Request<{}, {}, SendReActivateAccountReq["body"]>,
  res: Response
) {
  const { email } = req.body;
  const user = await readUserByEmail(email);

  if (!user) throw new BadRequestError("Email không tồn tại");
  if (user.status == "ACTIVE")
    throw new BadRequestError("Tài khoản của bạn đang hoạt động");
  if (user.status == "DISABLED")
    throw new BadRequestError("Tài khoản của bạn đã bị vô hiệu hoá vĩnh viễn");

  const session = await randId();
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);

  const token = signJWT(
    {
      type: "reActivate",
      session,
      exp: expires,
    },
    env.JWT_SECRET
  );
  const reactivateLink = `${env.CLIENT_URL}/reactivate?token=${token}`;

  await Promise.all([
    editUserById(user.id, {
      reActiveToken: session,
      reActiveExpires: new Date(expires * 1000),
    }),
    writeUserTokenCache({
      type: "reActivate",
      userId: user.id,
      expires: new Date(expires * 1000),
      session,
    }),
    sendEmailProducer({
      template: emaiEnum.REACTIVATE_ACCOUNT,
      receiver: user.email,
      locals: {
        username: user.username,
        reactivateLink,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Gửi email thành công",
  });
}

export async function reActivateAccount(
  req: Request<{}, {}, {}, { token?: string | string[] | undefined }>,
  res: Response
) {
  const { token } = req.query;
  if (typeof token != "string") throw new NotFoundError();

  const tokenVerify = verifyJWT<UserToken>(token, env.JWT_SECRET);
  if (!tokenVerify || tokenVerify.type != "reActivate")
    throw new BadRequestError("Phiên của bạn đã hết hạn");
  const user =
    (await readUserTokenCache(tokenVerify)) ||
    (await readUserByToken(tokenVerify));
  if (!user) throw new BadRequestError("Phiên của bạn đã hết hạn");

  await Promise.all([
    editUserById(user.id, {
      status: "ACTIVE",
      reActiveExpires: new Date(),
      reActiveToken: null,
    }),
    removeUserTokenCache(tokenVerify),
  ]);

  return res.status(StatusCodes.OK).send({
    message: "Tài khoản đã được kích hoạt",
  });
}
