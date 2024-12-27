import { type Application } from "express";
import healthRouter from "@/routes/health";
import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";
import displayRouter from "@/routes/display";
import departmentRouter from "@/routes/department";

const BASE_PATH = "/api/v1";

export function appRoutes(app: Application) {
  app.use(BASE_PATH, healthRouter);
  app.use(BASE_PATH, authRouter);
  app.use(BASE_PATH, userRouter);
  app.use(BASE_PATH, displayRouter);
  app.use(BASE_PATH, departmentRouter);
}
