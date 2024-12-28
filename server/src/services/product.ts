import {
  CreateProductData,
  SearchProduct,
  UpdateProductData,
} from "@/schemas/product";
import prisma from "./db";
import { Prisma } from "@prisma/client";

export async function searchProduct(data: SearchProduct) {
  const where: Prisma.ProductsWhereInput = {
    name: data.name,
    userId: data.userId,
  };

  const take = data.limit || 10;
  const page = (!data.page || data.page <= 0 ? 1 : data.page) - 1;
  const skip = page * take;

  let orderBy: Prisma.ProductsOrderByWithAggregationInput[] =
    data.orderBy?.map((o) => ({ [o.column]: o.order })) || [];

  const [products, total] = await prisma.$transaction([
    prisma.products.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            picture: true,
          },
        },
      },
    }),
    prisma.products.count({ where }),
  ]);
}

export async function getProductById(productId: string) {
  return prisma.products.findUnique({
    where: { id: productId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          picture: true,
        },
      },
    },
  });
}

export async function getProducts() {
  return prisma.products.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          picture: true,
        },
      },
    },
  });
}

export async function createProduct(data: CreateProductData) {
  return prisma.products.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          picture: true,
        },
      },
    },
  });
}

export async function updateProductById(
  productId: string,
  data: UpdateProductData
) {
  return prisma.products.update({
    where: {
      id: productId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          picture: true,
        },
      },
    },
  });
}

export async function deleteProductById(productId: string) {
  return await prisma.products.delete({
    where: {
      id: productId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          picture: true,
        },
      },
    },
  });
}
