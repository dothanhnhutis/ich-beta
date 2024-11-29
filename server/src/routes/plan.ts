import { clearTaskOfPlan, getPlans, getTaskOfPlan } from "@/controllers/plant";
import { authMiddleware } from "@/middlewares/requiredAuth";
import express, { type Router } from "express";

const router: Router = express.Router();
function plantRouter(): Router {
  router.get("/plans", getPlans);
  router.get("/plans/:id/tasks", authMiddleware(), getTaskOfPlan);
  router.delete("/plans/:id/tasks/clear", authMiddleware(), clearTaskOfPlan);

  return router;
}

export default plantRouter();
