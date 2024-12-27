import {
  createDepartmentHandler,
  deleteDepartmentByIdHandler,
  getDepartmentByIdHandler,
  getDepartmentsHandler,
  updateDepartmentHandler,
} from "@/controllers/department";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "@/schemas/department";
import express, { type Router } from "express";

const router: Router = express.Router();
function departmentRouter(): Router {
  router.get("/departments", authMiddleware(), getDepartmentsHandler);

  router.get(
    "/departments/:departmentId",
    authMiddleware(),
    getDepartmentByIdHandler
  );

  router.post(
    "/departments",
    authMiddleware(),
    validateResource(createDepartmentSchema),
    createDepartmentHandler
  );

  router.put(
    "/departments",
    authMiddleware(),
    validateResource(updateDepartmentSchema),
    updateDepartmentHandler
  );

  router.delete(
    "/departments/:departmentId",
    authMiddleware(),
    deleteDepartmentByIdHandler
  );

  return router;
}

export default departmentRouter();
