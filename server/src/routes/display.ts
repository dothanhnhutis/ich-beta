import {
  createDisplay,
  deleteDisplayById,
  getDisplayById,
  getDisplays,
  updateDisplayById,
} from "@/controllers/display";
import { health } from "@/controllers/health";
import { checkPolicy } from "@/middlewares/checkpolicy";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import {
  createDisplaySchema,
  updateDisplayByIdSchema,
} from "@/schemas/display";
import express, { type Router } from "express";

const router: Router = express.Router();
function displayRouter(): Router {
  router.post(
    "/displays",
    authMiddleware(),
    validateResource(createDisplaySchema),
    checkPolicy("create", "displays"),
    createDisplay
  );

  router.get(
    "/displays/:id",
    authMiddleware(),
    checkPolicy("read", "displays"),
    getDisplayById
  );

  router.get(
    "/displays",
    authMiddleware(),
    checkPolicy("read", "displays"),
    // validateResource(searchDisplaySchema),

    getDisplays
  );

  router.put(
    "/displays/:id",
    authMiddleware(),
    validateResource(updateDisplayByIdSchema),
    checkPolicy("update", "displays"),
    updateDisplayById
  );

  router.put(
    "/displays",
    authMiddleware(),
    checkPolicy("delete", "displays"),
    deleteDisplayById
  );
  return router;
}

export default displayRouter();
