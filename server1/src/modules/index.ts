import { Router } from "express";
import userModule from "./user";

const router = Router();

router.use("/users", userModule);

export default router;
