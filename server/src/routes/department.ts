import {
  getDepartments,
  getDisplaysOfDepartment,
} from "@/controllers/department";
import { checkPermission } from "@/middlewares/checkPermission";
import { authMiddleware } from "@/middlewares/requiredAuth";
import express, { type Router } from "express";

const router: Router = express.Router();
function departmentRouter(): Router {
  router.get(
    "/departments/:id/displays",
    authMiddleware(),
    getDisplaysOfDepartment
  );

  router.get(
    "/departments",
    authMiddleware(),
    checkPermission("read:departments"),
    getDepartments
  );

  return router;
}

export default departmentRouter();
