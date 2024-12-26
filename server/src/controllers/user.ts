import env from "@/configs/env";
import { BadRequestError, PermissionError } from "@/error-handler";
import {
  readSessionCacheByKey,
  readSessionCacheOfUser,
  removeSessionBySessionData,
  removeSessionsOfUser,
} from "@/redis/session.cache";
import {
  removeMFACache,
  writeMFACache,
  readSetupMFA,
  removeSetupMFA,
  writeSetupMFA,
} from "@/redis/mfa.cache";
import {
  ChangeEmailReq,
  ChangePasswordReq,
  EnableMFAReq,
  InitPasswordReq,
  ReplaceEmailReq,
  SetupMFAReq,
  UpdateEmailReq,
  UpdateProfileReq,
  UpdateUserByIdReq,
} from "@/schemas/user";
import { readMFA, removeMFA, writeMFA } from "@/services/mfa";
import {
  editUserById,
  readUserByEmail,
  readUserById,
  updateUserPoliciesByIdService,
} from "@/services/user";
import { validateMFA } from "@/utils/mfa";
import { generateQRCode } from "@/utils/qrcode";
import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { compareData, generateOTP, randId, signJWT } from "@/utils/helper";
import { emaiEnum } from "@/utils/nodemailer";
import { sendEmailProducer } from "@/rabbitmq/mail";
import {
  readChangeEmailSessionCache,
  removeChangeEmailSessionCache,
  removeEmailCache,
  writeChangeEmailSessionCache,
  writeUserTokenCache,
} from "@/redis/user.cache";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import { readPoliciesInRangeService } from "@/services/policies";

export async function currentUser(req: Request, res: Response) {
  const { password, ...noPass } = req.user!;
  return res
    .status(StatusCodes.OK)
    .json({ ...noPass, hasPassword: !!password });
}

export async function disactivate(
  req: Request<{ sessionId: string }>,
  res: Response
) {
  const { id } = req.user!;
  await Promise.all([
    editUserById(id, {
      status: "SUSPENDED",
    }),
    removeSessionsOfUser(id),
  ]);
  res.status(StatusCodes.OK).clearCookie(env.SESSION_KEY_NAME).json({
    message:
      "Tài khoản của bạn đã bị vô hiệu hóa. Bạn có thể kích hoạt lại bất cứ lúc nào!",
  });
}

export async function signOut(req: Request, res: Response) {
  if (req.sessionData) await removeSessionBySessionData(req.sessionData);
  res
    .status(StatusCodes.OK)
    .clearCookie(env.SESSION_KEY_NAME)
    .json({
      message: "Đăng xuất thành công",
    })
    .end();
}

export async function updateProfile(
  req: Request<{}, {}, UpdateProfileReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  await editUserById(id, req.body);
  return res
    .status(StatusCodes.OK)
    .json({ message: "Cập nhật hồ sơ thành công." });
}

// ------------------ password ------------------

export async function changePassword(
  req: Request<{}, {}, ChangePasswordReq["body"]>,
  res: Response
) {
  const { id, password: hashOldPassword } = req.user!;
  const { newPassword, oldPassword, isSignOut } = req.body;

  if (!oldPassword)
    throw new BadRequestError("Mật khẩu cũ không đúng do chưa được thiết lập.");
  if (!hashOldPassword) throw new BadRequestError("Mật khẩu cũ không đúng");
  if (!(await compareData(hashOldPassword, oldPassword)))
    throw new BadRequestError("Mật khẩu cũ không đúng");

  await editUserById(id, {
    password: newPassword,
  });

  if (isSignOut == "ALL") {
    await removeSessionsOfUser(id);
    res.clearCookie(env.SESSION_KEY_NAME);
  } else if (isSignOut == "EXCEPT_CURRENT") {
    await removeSessionsOfUser(id, [req.sessionData!.id]);
  }

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật mật khẩu thành công",
  });
}

export async function initPassword(
  req: Request<{}, {}, InitPasswordReq["body"]>,
  res: Response
) {
  const { id, password } = req.user!;
  const { newPassword } = req.body;

  if (password) throw new BadRequestError("Thiết lập mật khẩu thất bại.");

  await editUserById(id, {
    password: newPassword,
  });

  return res.status(StatusCodes.OK).json({
    message: "Tạo mật khẩu thành công",
  });
}
// ------------------ email ------------------

export async function resendVerifyEmail(req: Request, res: Response) {
  const { username, email, emailVerified, id } = req.user!;
  if (emailVerified) throw new BadRequestError("Tài khoản đã xác thực");

  const session = await randId();
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);
  const token = signJWT(
    {
      type: "emailVerification",
      session: session,
      exp: expires,
    },
    env.JWT_SECRET
  );

  await Promise.all([
    editUserById(id, {
      emailVerificationToken: session,
      emailVerificationExpires: new Date(expires * 1000),
    }),
    writeUserTokenCache({
      type: "emailVerification",
      userId: id,
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

  return res.status(StatusCodes.OK).json({
    message: "Đã gửi lại email xác minh",
  });
}

export async function changeEmail(
  req: Request<{}, {}, ChangeEmailReq["body"]>,
  res: Response
) {
  const { email: newEmail } = req.body;
  const { id, email } = req.user!;

  if (newEmail == email)
    throw new BadRequestError("Email mới không thể giống với email hiện tại");

  const checkNewEmail = await readUserByEmail(newEmail);
  if (checkNewEmail) throw new BadRequestError("Email đã tồn tại");

  const sessionId = await randId();
  const otp: string = generateOTP();

  await Promise.all([
    writeChangeEmailSessionCache(sessionId, { userId: id, newEmail, otp }),
    sendEmailProducer({
      template: emaiEnum.OTP_VERIFY_ACCOUNT,
      receiver: newEmail,
      locals: {
        otp,
      },
    }),
  ]);

  return res.status(StatusCodes.OK).json({
    message: "Mã xác minh đã được gửi đến email của bạn",
    sessionId,
  });
}

export async function updateEmailByOTP(
  req: Request<{}, {}, UpdateEmailReq["body"]>,
  res: Response
) {
  const { otp, sessionId } = req.body;
  const { id } = req.user!;

  const sessionData = await readChangeEmailSessionCache(sessionId);
  if (!sessionData || sessionData.userId != id)
    throw new BadRequestError("Phiên đã hết hạn.");

  if (!(await compareData(sessionData.otp, otp)))
    throw new BadRequestError("Mã xác thực không hợp lệ");

  await Promise.all([
    editUserById(id, {
      email: sessionData.newEmail,
    }),
    removeChangeEmailSessionCache(sessionId),
  ]);

  return res.status(StatusCodes.OK).json({
    message: "Cập nhật email thành công",
  });
}

export async function replaceEmail(
  req: Request<{}, {}, ReplaceEmailReq["body"]>,
  res: Response
) {
  const { email: newEmail } = req.body;
  const { id, email, emailVerified, username } = req.user!;

  if (emailVerified) throw new BadRequestError("Tài khoản đã xác thực email");

  if (newEmail == email)
    throw new BadRequestError("Email mới không thể giống với email hiện tại");

  const checkNewEmail = await readUserByEmail(newEmail);
  if (checkNewEmail) throw new BadRequestError("Email đã tồn tại");

  const session = await randId();
  const expires: number = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);

  const token = signJWT(
    {
      type: "emailVerification",
      session: session,
      exp: expires,
    },
    env.JWT_SECRET
  );

  await Promise.all([
    removeEmailCache(email),
    editUserById(id, {
      email: newEmail,
      emailVerificationToken: session,
      emailVerificationExpires: new Date(expires * 1000),
    }),
    writeUserTokenCache({
      type: "emailVerification",
      userId: id,
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

  return res.status(StatusCodes.OK).json({
    message: "Email đã được thay đổi.",
  });
}

// ------------------ mfa ------------------

export async function createMFA(
  req: Request<{}, {}, SetupMFAReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const { deviceName } = req.body;
  const mfa = await readMFA(id);
  if (mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");
  const generateMFA = await writeSetupMFA(id, deviceName);
  if (!generateMFA) throw new BadRequestError("Tạo MFA thất bại");
  const imageUrl = await generateQRCode(generateMFA.oauth_url);
  return res.status(StatusCodes.OK).json({
    message: "Quét mã QR này bằng ứng dụng xác thực của bạn",
    data: {
      ...generateMFA,
      qrCodeUrl: imageUrl,
    },
  });
}

export async function enableMFA(
  req: Request<{}, {}, EnableMFAReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const { mfa_code1, mfa_code2 } = req.body;
  const mfa = await readMFA(id);
  if (mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) đã được bật");
  const totpData = await readSetupMFA(id);
  if (!totpData)
    throw new BadRequestError("Phiên xác thực đa yếu tố (MFA) đã hết hạn");

  if (
    validateMFA({ secret: totpData.base32, token: mfa_code1 }) == null ||
    validateMFA({ secret: totpData.base32, token: mfa_code2 }) == null
  )
    throw new BadRequestError("Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn");

  const newMFA = await writeMFA({ userId: id, secretKey: totpData.base32 });
  await Promise.all([writeMFACache(newMFA), removeSetupMFA(id)]);

  res.status(StatusCodes.OK).json({
    message: "Xác thực đa yếu tố (MFA) đã được bật",
  });
}

export async function disableMFA(req: Request, res: Response) {
  const { id } = req.user!;
  const { mfa_code1, mfa_code2 } = req.body;
  const mfa = await readMFA(id);
  if (!mfa) throw new BadRequestError("Xác thực đa yếu tố (MFA) chưa được bật");
  if (
    validateMFA({ secret: mfa.secretKey, token: mfa_code1 }) == null ||
    validateMFA({ secret: mfa.secretKey, token: mfa_code2 }) == null
  )
    throw new BadRequestError("Mã xác thực đa yếu tố (MFA) 1 và 2 đã hết hạn");
  await Promise.all([removeMFA(id), removeMFACache(id)]);

  return res
    .status(StatusCodes.OK)
    .json({ message: "Xác thực đa yếu tố (MFA) đã được tắt" });
}

// ------------------ sessions ------------------

export async function getSessionOfUser(req: Request, res: Response) {
  const { id } = req.user!;
  const sessions = await readSessionCacheOfUser(id);
  res.status(StatusCodes.OK).json(sessions);
}

export async function currentSession(req: Request, res: Response) {
  res.status(StatusCodes.OK).json(req.sessionData);
}

export async function deleteSessionById(
  req: Request<{ sessionId: string }>,
  res: Response
) {
  const { id } = req.user!;
  const key = `${env.SESSION_KEY_NAME}:${id}:${req.params.sessionId}`;
  const session = await readSessionCacheByKey(key);
  if (!session || session.userId != id)
    throw new BadRequestError("Phiên không tồn tại");

  if (req.sessionData!.id == session.id)
    throw new BadRequestError("Không thể xoá phiên hiện tại");

  await removeSessionBySessionData(session);
  res.status(StatusCodes.OK).json({
    message: "Xoá phiên thành công",
  });
}

// ------------------ admin ------------------

export async function updateUserById(
  req: Request<UpdateUserByIdReq["params"], {}, UpdateUserByIdReq["body"]>,
  res: Response
) {
  const user = await readUserById(req.params.userId);
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition, user))
    throw new PermissionError();

  if (!user) throw new BadRequestError("userId không tồn tại");

  const { policyIds, ...data } = req.body;
  await editUserById(req.params.userId, data);

  if (policyIds) {
    let policys = [];
    if (policyIds.length > 0)
      policys = await readPoliciesInRangeService(policyIds);

    if (policys.length != policyIds.length)
      throw new BadRequestError("policyIds[?] không tồn tại.");

    await updateUserPoliciesByIdService(req.params.userId, policyIds);
  }

  res.status(StatusCodes.OK).json({
    message: "Cập nhật user thành công",
  });
}
