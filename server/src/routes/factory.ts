import express, { Router } from "express";
import {
  createFactoryHandler,
  deleteFactoryByIdHandler,
  getFactorieByIdHandler,
  getFactoriesHandler,
  updateFactoryByIdHandler,
} from "@/controllers/factory";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import { createFactorySchema, updateFactorySchema } from "@/schemas/factory";

const router: Router = express.Router();
function factoryRouter() {
  router.get("/factories/:factoryId", authMiddleware(), getFactorieByIdHandler);
  router.get("/factories", authMiddleware(), getFactoriesHandler);

  router.post(
    "/factories",
    authMiddleware(),
    validateResource(createFactorySchema),
    createFactoryHandler
  );

  router.put(
    "/factories/:factoryId",
    authMiddleware(),
    validateResource(updateFactorySchema),
    updateFactoryByIdHandler
  );

  router.delete(
    "/factories/:factoryId",
    authMiddleware(),
    deleteFactoryByIdHandler
  );
  return router;
}

export default factoryRouter();
