import { getPlans, getTaskOfPlan } from "@/controllers/plant";
import express, { type Router } from "express";

const router: Router = express.Router();
function plantRouter(): Router {
  router.get("/plans", getPlans);
  router.get("/plans/:id/tasks", getTaskOfPlan);

  return router;
}

export default plantRouter();
