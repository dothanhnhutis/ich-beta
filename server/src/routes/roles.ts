import { createRole } from "@/controllers/roles";
import validateResource from "@/middlewares/validateResource";
import { createRoleSchema } from "@/schemas/roles";
import express, { type Router } from "express";

const router: Router = express.Router();
function roleRouter(): Router {
  router.post("/roles", validateResource(createRoleSchema), createRole);
  return router;
}

export default roleRouter();
