import express from "express";
import UserController from "./user.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import { setupMFASchema, signInSchema, signUpSchema } from "./user.schemas";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import { rateLimitUserId } from "@/shared/middlewares/rateLimit";

const router = express.Router();

router.get(
  "/me",
  authMiddleware({ emailVerified: false }),
  UserController.currentUser
);
router.get("/sessions/me", authMiddleware(), UserController.getCurrentSession);
router.get("/sessions", authMiddleware(), UserController.getSessionsOfUser);
router.get(
  "/resend-verify-email",
  rateLimitUserId,
  authMiddleware({ emailVerified: false }),
  UserController.resendVerifyEmail
);
router.post("/signup", validateResource(signUpSchema), UserController.signUp);
router.post("/signin", validateResource(signInSchema), UserController.signIn);
router.post(
  "/mfa",
  authMiddleware(),
  validateResource(setupMFASchema),
  UserController.createMFA
);

router.delete("/signout", UserController.signOut);

export default router;
