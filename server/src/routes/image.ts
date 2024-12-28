import express, { type Router } from "express";
import { uploadImageHandler } from "@/controllers/image";
import { authMiddleware } from "@/middlewares/requiredAuth";

const router: Router = express.Router();
function imageRouter(): Router {
  router.post("/uploads", authMiddleware(), uploadImageHandler);
  return router;
}

export default imageRouter();
