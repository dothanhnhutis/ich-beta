import { productRegex } from "@/configs/constants";
import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { CreateProductReq, SearchProduct } from "@/schemas/product";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  searchProduct,
  updateProductById,
} from "@/services/product";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function searhProductHandler(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user, "read:products");
  if (!isValidAccess) throw new PermissionError();

  const { name, userId, orderBy, page, limit } = req.query;

  const queryData: SearchProduct = {};

  if (typeof name == "string") queryData.name = name;
  if (typeof userId == "string") queryData.userId = userId;
  if (typeof orderBy == "string" && productRegex.test(orderBy)) {
    const splitorderBy = orderBy.split(".");
    queryData.orderBy = [
      {
        column: splitorderBy[0],
        order: splitorderBy[1],
      },
    ] as SearchProduct["orderBy"];
  }
  if (
    Array.isArray(orderBy) &&
    orderBy.every((item) => typeof item === "string")
  ) {
    const orderBys = orderBy
      .filter((v) => typeof v == "string" && productRegex.test(v))
      .map((data) => {
        const dataSplit = data.split(".");
        return {
          column: dataSplit[0],
          order: dataSplit[1],
        };
      }) as SearchProduct["orderBy"];

    queryData.orderBy = orderBys;
  }

  if (typeof limit == "string") {
    const intRegex = /\d+/;
    if (intRegex.test(limit) && parseInt(limit) > 0) {
      queryData.limit = parseInt(limit);
    }
  }

  if (typeof page == "string") {
    const intRegex = /\d+/;
    if (intRegex.test(page) && parseInt(page) > 0) {
      queryData.page = parseInt(page);
    }
  }

  const data = await searchProduct(queryData);

  res.status(StatusCodes.OK).json(data);
}

export async function getProductByIdHandler(
  req: Request<{ productId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:products");
  if (!isValidAccess) throw new PermissionError();
  const product = await getProductById(req.params.productId);
  res.status(StatusCodes.OK).json(product);
}

export async function getProductsHandler(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user, "read:products");
  if (!isValidAccess) throw new PermissionError();
  const products = await getProducts();
  res.status(StatusCodes.OK).json(products);
}

export async function createProductHandler(
  req: Request<{}, {}, CreateProductReq["body"]>,
  res: Response
) {
  const { id } = req.user!;
  const isValidAccess = hasPermission(req.user, "write:products");
  if (!isValidAccess) throw new PermissionError();

  const product = await createProduct({ ...req.body, userId: id });
  res.status(StatusCodes.OK).json({
    message: "Tạo sản phẩm thành công",
    product,
  });
}

export async function updateProductByIdHandler(
  req: Request<{ productId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "update:products");
  if (!isValidAccess) throw new PermissionError();
  const product = await getProductById(req.params.productId);
  if (!product)
    throw new BadRequestError(
      `Mã sản phẩm id=${req.params.productId} không tồn tại.`
    );

  const newProduct = await updateProductById(req.params.productId, req.body);
  res.status(StatusCodes.OK).json({
    message: "Cập nhật sản phẩm thành công",
    product: newProduct,
  });
}

export async function deleteProductHandler(
  req: Request<{ productId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "delete:products");
  if (!isValidAccess) throw new PermissionError();

  const product = await getProductById(req.params.productId);
  if (!product)
    throw new BadRequestError(
      `Mã sản phẩm id=${req.params.productId} không tồn tại.`
    );

  const productDelete = await deleteProductById(req.params.productId);
  res.status(StatusCodes.OK).json({
    message: "Xoá sản phẩm thành công",
    product: productDelete,
  });
}
