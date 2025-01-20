import "express-async-errors";

import express, {
  type Express,
  Request,
  Response,
  NextFunction,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import env from "@/shared/configs/env";
import { CustomError, NotFoundError } from "./error-handler";
import { StatusCodes } from "http-status-codes";
import moduleRoutes from "@/modules";
import deserializeCookie from "@/shared/middlewares/deserializeCookie";
import deserializeUser from "@/shared/middlewares/deserializeUser";

export function buildServer() {
  const server: Express = express();
  server.set("trust proxy", 1);
  server.use(morgan(env.NODE_ENV == "production" ? "combined" : "dev"));
  server.use(helmet());
  server.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    })
  );

  server.use(compression());
  server.use(express.json({ limit: "200mb" }));
  server.use(express.urlencoded({ extended: true, limit: "200mb" }));
  server.use(deserializeCookie);
  server.use(deserializeUser);

  server.use("/api", moduleRoutes);

  server.use("*", (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError();
  });

  server.use(
    (error: CustomError, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Something went wrong" });
    }
  );

  return server;
}
