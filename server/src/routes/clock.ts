import express, { type Router } from "express";
import { createAlarmHandler } from "@/controllers/clock";

const router: Router = express.Router();
function alarmRouter(): Router {
  // router.get("/clock/alarms", createAlarmHandler);
  router.post("/clock/alarms", createAlarmHandler);

  // router.post("/clock/timers", createAlarmHandler);

  return router;
}

export default alarmRouter();
