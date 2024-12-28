import {
  createDisplayHandler,
  deleteDisplayByIdHandler,
  getDisplayByIdHandler,
  searchDisplaysHandler,
  updateDisplayByIdHandler,
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
    createDisplayHandler
  );

  router.get("/displays/:id", authMiddleware(), getDisplayByIdHandler);

  router.get("/displays/search", authMiddleware(), searchDisplaysHandler);

  router.put(
    "/displays/:id",
    authMiddleware(),
    validateResource(updateDisplayByIdSchema),
    updateDisplayByIdHandler
  );

  router.delete("/displays", authMiddleware(), deleteDisplayByIdHandler);
  return router;
}

export default displayRouter();
