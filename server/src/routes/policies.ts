import {
  createPolicy,
  getPolicies,
  getPolicyById,
} from "@/controllers/policies";
import { checkPolicy } from "@/middlewares/checkpolicy";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import { createPolicychema } from "@/schemas/policies";
import express, { type Router } from "express";

const router: Router = express.Router();
function roleRouter(): Router {
  router.get(
    "/policies",
    authMiddleware(),
    checkPolicy("policies", "read"),
    getPolicies
  );
  router.get(
    "/policies/:id",
    authMiddleware(),
    checkPolicy("policies", "read"),
    getPolicyById
  );
  router.post(
    "/policies",
    authMiddleware(),
    validateResource(createPolicychema),
    checkPolicy("policies", "create"),
    createPolicy
  );

  return router;
}

export default roleRouter();
