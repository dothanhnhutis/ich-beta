import { Request } from "express";
import { BadRequestError } from "@/shared/utils/error-handler";
import { SignInReq } from "./user.schemas";
import UserReposities from "./user.repositories";
import { compareData } from "@/shared/utils/password";
import { randId } from "@/shared/utils/helper";
import UserCache from "./user.cache";

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
      const newSession = await UserCache.createSession({
        userId: user.id,
        reqInfo: {
          ip: req.ip || "",
          userAgentRaw: req.headers["user-agent"] || "",
        },
      });

      return newSession;
    }
  }

  static async signOut(userId: string, sessionId: string) {
    await UserCache.deleteSession(userId, sessionId);
  }
}
