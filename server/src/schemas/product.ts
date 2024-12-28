import * as z from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Tên sản phẩm không được bỏ trống",
      invalid_type_error: "Tên sản phẩm là chuỗi",
    }),
    images: z.array(
      z
        .string({
          invalid_type_error: "Hình sản phẩm là chuỗi",
        })
        .url("Hình sản phẩm phải là url")
    ),
    innerBoxQuantity: z
      .number({
        invalid_type_error: "Quy cách sản phẩm phải là số nguyên",
      })
      .refine((v) => v < 0, {
        message: "Quy cách sản phẩm phải là số nguyên dương",
      })
      .optional()
      .default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    productId: z.string(),
  }),
  body: z
    .object({
      name: z.string({
        required_error: "Tên sản phẩm không được bỏ trống",
        invalid_type_error: "Tên sản phẩm là chuỗi",
      }),
      images: z.array(
        z
          .string({
            invalid_type_error: "Hình sản phẩm là chuỗi",
          })
          .url("Hình sản phẩm phải là url")
      ),
      innerBoxQuantity: z
        .number({
          invalid_type_error: "Quy cách sản phẩm phải là số nguyên",
        })
        .refine((v) => v < 0, {
          message: "Quy cách sản phẩm phải là số nguyên dương",
        })
        .optional()
        .default(0),
    })
    .strip()
    .partial(),
});

export type CreateProductReq = z.infer<typeof createProductSchema>;
export type UpdateProductReq = z.infer<typeof updateProductSchema>;

export type CreateProductData = CreateProductReq["body"] & {
  userId: string;
};

export type UpdateProductData = UpdateProductReq["body"];

export type SearchProduct = {
  name?: string;
  userId?: string;
  orderBy?: {
    column: "name" | "innerBoxQuantity";
    order: "asc" | "desc";
  }[];
  page?: number;
  limit?: number;
};
