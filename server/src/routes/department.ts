import {
  getDepartments,
  getDisplaysOfDepartment,
} from "@/controllers/department";
import { checkPolicy } from "@/middlewares/checkpolicy";
import { authMiddleware } from "@/middlewares/requiredAuth";
import express, { type Router } from "express";

const router: Router = express.Router();
function departmentRouter(): Router {
  router.get(
    "/departments/:id/displays",
    authMiddleware(),
    checkPolicy("read", "departments"),
    getDisplaysOfDepartment
  );

  router.get(
    "/departments",
    authMiddleware(),
    checkPolicy("read", "departments"),
    getDepartments
  );

  return router;
}

export default departmentRouter();
