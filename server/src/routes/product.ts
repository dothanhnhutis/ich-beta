import {
  createProductHandler,
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  searhProductHandler,
} from "@/controllers/product";
import { authMiddleware } from "@/middlewares/requiredAuth";
import express, { type Router } from "express";

const router: Router = express.Router();
function productRouter(): Router {
  router.get("/products/search", authMiddleware(), searhProductHandler);
  router.get("/products/:productId", authMiddleware(), getProductByIdHandler);
  router.get("/products", authMiddleware(), getProductsHandler);
  router.post("/products", authMiddleware(), createProductHandler);
  router.put("/products", authMiddleware(), createProductHandler);
  router.delete("/products", authMiddleware(), deleteProductHandler);
  return router;
}

export default productRouter();
