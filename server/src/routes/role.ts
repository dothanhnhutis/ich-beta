import {
  createRoleHandler,
  deleteRoleByIdHandler,
  getRoleByIdHandler,
  getRolesHandler,
  updateRoleByIdHandler,
} from "@/controllers/role";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import { createRoleSchema, updateRoleSchema } from "@/schemas/role";
import express, { type Router } from "express";

const router: Router = express.Router();
function roleRouter(): Router {
  router.get("/roles", authMiddleware(), getRolesHandler);
  router.get("/roles/:roleId", authMiddleware(), getRoleByIdHandler);

  router.post(
    "/roles",
    authMiddleware(),
    validateResource(createRoleSchema),
    createRoleHandler
  );

  router.put(
    "/roles/:roleId",
    authMiddleware(),
    validateResource(updateRoleSchema),
    updateRoleByIdHandler
  );

  router.delete("/roles/:roleId", authMiddleware(), deleteRoleByIdHandler);

  return router;
}

export default roleRouter();
