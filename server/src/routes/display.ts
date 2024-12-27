import {
  createDisplay,
  deleteDisplayById,
  getDisplayById,
  queryDisplays,
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

  router.get("/displays/:id", authMiddleware(), getDisplayById);

  router.get("/displays/search", authMiddleware(), queryDisplays);

  router.put(
    "/displays/:id",
    authMiddleware(),
    validateResource(updateDisplayByIdSchema),
    updateDisplayById
  );

  router.delete("/displays", authMiddleware(), deleteDisplayById);
  return router;
}

export default displayRouter();
