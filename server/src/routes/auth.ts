import {
  confirmEmail,
  getToken,
  reActivateAccount,
  recover,
  resetPassword,
  sendReActivateAccount,
  signIn,
  signInWithMFA,
  signUp,
} from "@/controllers/auth";
import { rateLimitEmail } from "@/middlewares/rateLimit";
import validateResource from "@/middlewares/validateResource";
import {
  recoverSchema,
  resetPasswordSchema,
  sendReActivateAccountSchema,
  signInSchema,
  signInWithMFASchema,
  signUpSchema,
} from "@/schemas/auth";
import express, { type Router } from "express";

const router: Router = express.Router();
function authRouter(): Router {
  router.get("/auth/confirm-email", confirmEmail);
  router.get("/auth/session", getToken);
  router.get("/auth/reactivate", reActivateAccount);

  router.post(
    "/auth/reactivate",
    rateLimitEmail,
    validateResource(sendReActivateAccountSchema),
    sendReActivateAccount
  );

  router.post("/auth/signin", validateResource(signInSchema), signIn);
  router.post(
    "/auth/signin/mfa",
    validateResource(signInWithMFASchema),
    signInWithMFA
  );

  router.post("/auth/signup", validateResource(signUpSchema), signUp);
  router.post("/auth/recover", validateResource(recoverSchema), recover);
  router.post(
    "/auth/reset-password",
    validateResource(resetPasswordSchema),
    resetPassword
  );

  return router;
}

export default authRouter();
