import express from "express";
import UserController from "./user.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import {
  enableMFASchema,
  recoverSchema,
  resetPasswordSchema,
  sendReActivateAccountSchema,
  setupMFASchema,
  signInSchema,
  signInWithMFASchema,
  signUpSchema,
} from "./user.schemas";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import {
  rateLimitEmail,
  rateLimitUserId,
} from "@/shared/middlewares/rateLimit";

const router = express.Router();

router.get(
  "/me",
  authMiddleware({ emailVerified: false }),
  UserController.currentUser
);

router.get("/token", UserController.checkToken);

router.get("/sessions/me", authMiddleware(), UserController.getCurrentSession);
router.get("/sessions", authMiddleware(), UserController.getSessionsOfUser);
router.get("/confirm-email", UserController.confirmEmail);
router.get(
  "/resend-verify-email",
  rateLimitUserId,
  authMiddleware({ emailVerified: false }),
  UserController.resendVerifyEmail
);

router.get("/active-account", UserController.activeAccount);
router.post("/signup", validateResource(signUpSchema), UserController.signUp);
router.post(
  "/signin/mfa",
  validateResource(signInWithMFASchema),
  UserController.signInWithMFA
);
router.post("/signin", validateResource(signInSchema), UserController.signIn);

router.post(
  "/recover",
  rateLimitEmail,
  validateResource(recoverSchema),
  UserController.recover
);
router.post(
  "/reset-password",
  validateResource(resetPasswordSchema),
  UserController.resetPassword
);

router.post(
  "/reactivate",
  rateLimitEmail,
  validateResource(sendReActivateAccountSchema),
  UserController.sendReActivateAccount
);

router.post(
  "/mfa",
  authMiddleware(),
  validateResource(setupMFASchema),
  UserController.createMFA
);

router.put(
  "/mfa",
  authMiddleware(),
  validateResource(enableMFASchema),
  UserController.enableMFA
);

router.delete("/mfa", authMiddleware(), UserController.disableMFA);

router.delete("/signout", UserController.signOut);
router.delete(
  "/disactivate",
  authMiddleware({ emailVerified: false }),
  UserController.disactivate
);

export default router;
