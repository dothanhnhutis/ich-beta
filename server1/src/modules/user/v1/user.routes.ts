import express from "express";
import UserController from "./user.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import { signInSchema } from "./user.schemas";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";

const router = express.Router();

router.get(
  "/me",
  authMiddleware({ emailVerified: false }),
  UserController.currentUser
);
router.post("/signin", validateResource(signInSchema), UserController.signIn);
router.delete("/signout", UserController.signOut);

export default router;
