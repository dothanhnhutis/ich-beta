import express, { type Router } from "express";

const router: Router = express.Router();
function productRouter(): Router {
  router.get("/products", createProduct);
  return router;
}

export default productRouter();
