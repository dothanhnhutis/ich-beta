import * as z from "zod";

export const createFactorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Tên nhà máy là bất buộc",
      invalid_type_error: "Tên nhà máy không được bỏ trống",
    }),
    address: z.string({
      required_error: "Địa chỉ nhà máy là bất buộc",
      invalid_type_error: "Địa chỉ nhà máy không được bỏ trống",
    }),
  }),
});

export const updateFactorySchema = z.object({
  params: z.object({
    factoryId: z.string(),
  }),
  body: z.object({
    name: z.string({
      required_error: "Tên nhà máy là bất buộc",
      invalid_type_error: "Tên nhà máy không được bỏ trống",
    }),
    address: z.string({
      required_error: "Địa chỉ nhà máy là bất buộc",
      invalid_type_error: "Địa chỉ nhà máy không được bỏ trống",
    }),
  }),
});

export type CreateFactoryReq = z.infer<typeof createFactorySchema>;
export type UpdateFactoryReq = z.infer<typeof updateFactorySchema>;
export type CreateFactory = {
  name: string;
  address: string;
};

export type UpdateFactory = CreateFactory;
