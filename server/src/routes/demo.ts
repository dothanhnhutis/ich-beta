import { clearTask, createTask } from "@/controllers/demo";
import validateResource from "@/middlewares/validateResource";
import { createTaskSchema } from "@/schemas/demo";
import express, { type Router } from "express";

const router: Router = express.Router();
function demoRouter(): Router {
  router.post("/task", validateResource(createTaskSchema), createTask);
  router.delete("/task", clearTask);
  return router;
}

export default demoRouter();
