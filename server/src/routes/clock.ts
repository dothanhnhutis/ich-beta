import express, { type Router } from "express";
import { createAlarmHandler } from "@/controllers/clock";
import { authMiddleware } from "@/middlewares/requiredAuth";
import { createAlarmSchema } from "@/schemas/clock";
import validateResource from "@/middlewares/validateResource";

const router: Router = express.Router();
function alarmRouter(): Router {
  // router.get("/clock/alarms", createAlarmHandler);
  router.post(
    "/clock/alarms",
    authMiddleware(),
    validateResource(createAlarmSchema),
    createAlarmHandler
  );

  // router.post("/clock/timers", createAlarmHandler);

  return router;
}

export default alarmRouter();
