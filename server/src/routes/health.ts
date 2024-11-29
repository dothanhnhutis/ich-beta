import { health } from "@/controllers/health";
import express, { type Router } from "express";

const router: Router = express.Router();
function healthRouter(): Router {
  router.get("/health", health);
  return router;
}

export default healthRouter();
