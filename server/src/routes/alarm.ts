import express, { type Router } from "express";
import { createAlarmHandler } from "@/controllers/alarm";

const router: Router = express.Router();
function alarmRouter(): Router {
  router.post("/alarms", createAlarmHandler);
  return router;
}

export default alarmRouter();
