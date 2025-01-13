import express, { type Router } from "express";
import { createAlarmHandler, createTimerHandler } from "@/controllers/clock";
import { authMiddleware } from "@/middlewares/requiredAuth";
import { createAlarmSchema, createTimerSchema } from "@/schemas/clock";
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

  router.post(
    "/clock/timers",
    authMiddleware(),
    validateResource(createTimerSchema),
    createTimerHandler
  );

  return router;
}

export default alarmRouter();
