import {
  createPolicy,
  deletePolicyById,
  getPolicies,
  getPolicyById,
  getPolicyMe,
  updatePolicyById,
} from "@/controllers/policies";
import { checkPolicy } from "@/middlewares/checkpolicy";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import { createPolicychema, updatePolicyByIdSchema } from "@/schemas/policies";
import express, { type Router } from "express";

const router: Router = express.Router();
function roleRouter(): Router {
  router.get("/policies/me", authMiddleware(), getPolicyMe);
  router.get(
    "/policies/:id",
    authMiddleware(),
    checkPolicy("read", "policies"),
    getPolicyById
  );
  router.get(
    "/policies",
    authMiddleware(),
    checkPolicy("read", "policies"),
    getPolicies
  );

  router.post(
    "/policies",
    authMiddleware(),
    validateResource(createPolicychema),
    checkPolicy("create", "policies"),
    createPolicy
  );

  router.put(
    "/policies/:id",
    authMiddleware(),
    validateResource(updatePolicyByIdSchema),
    checkPolicy("update", "policies"),
    updatePolicyById
  );

  router.delete(
    "/policies/:id",
    authMiddleware(),
    checkPolicy("delete", "policies"),
    deletePolicyById
  );

  return router;
}

export default roleRouter();
