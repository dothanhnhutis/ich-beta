import {
  createDisplay,
  deleteDisplayById,
  getDisplayById,
  getDisplays,
  updateDisplayById,
} from "@/controllers/display";
import { checkPermission } from "@/middlewares/checkPermission";
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
    createDisplay
  );

  router.get(
    "/displays/:id",
    authMiddleware(),
    checkPermission("read:displays"),
    getDisplayById
  );

  router.get(
    "/displays",
    authMiddleware(),
    checkPermission("read:displays"),
    // validateResource(searchDisplaySchema),

    getDisplays
  );

  router.put(
    "/displays/:id",
    authMiddleware(),
    validateResource(updateDisplayByIdSchema),
    checkPermission("update:displays"),
    updateDisplayById
  );

  router.put(
    "/displays",
    authMiddleware(),
    checkPermission("delete:displays"),
    deleteDisplayById
  );
  return router;
}

export default displayRouter();
