import { createTask } from "@/controllers/task";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import { createTaskSchema } from "@/schemas/task";
import express, { type Router } from "express";

const router: Router = express.Router();
function demoRouter(): Router {
  router.post(
    "/tasks",
    authMiddleware(),
    validateResource(createTaskSchema),
    createTask
  );

  return router;
}

export default demoRouter();
