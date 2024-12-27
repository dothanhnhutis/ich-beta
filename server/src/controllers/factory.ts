import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { CreateFactoryReq, UpdateFactoryReq } from "@/schemas/factory";
import {
  createFactory,
  deleteFactoryById,
  getFactoryById,
  getFactorys,
  updateFactoryById,
} from "@/services/factory";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getFactorieByIdHandler(
  req: Request<{ factoryId: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user!, "read:factories");
  if (!isValidAccess) throw new PermissionError();
  const factory = await getFactoryById(req.params.factoryId);
  return res.status(StatusCodes.OK).json(factory);
}

export async function getFactoriesHandler(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user!, "read:factories");
  if (!isValidAccess) throw new PermissionError();
  const factory = await getFactorys();
  return res.status(StatusCodes.OK).json(factory);
}

export async function createFactoryHandler(
  req: Request<{}, {}, CreateFactoryReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user!, "write:factories");
  if (!isValidAccess) throw new PermissionError();

  const newFactory = await createFactory(req.body);

  res.status(StatusCodes.CREATED).json({
    message: "Tạo nhà máy thành công",
    factory: newFactory,
  });
}

export async function updateFactoryByIdHandler(
  req: Request<UpdateFactoryReq["params"], {}, UpdateFactoryReq["body"]>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user!, "update:factories");
  if (!isValidAccess) throw new PermissionError();

  const factory = await getFactoryById(req.params.factoryId);
  if (!factory)
    throw new BadRequestError(
      `Mã nhà máy id=${req.params.factoryId} không tồn tại`
    );

  const newFactory = await updateFactoryById(req.params.factoryId, req.body);

  res.status(StatusCodes.OK).json({
    message: "Cập nhật nhà máy thành công",
    factory: newFactory,
  });
}

export async function deleteFactoryByIdHandler(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user!, "delete:factories");
  if (!isValidAccess) throw new PermissionError();
  const factory = await getFactoryById(req.params.factoryId);
  if (!factory)
    throw new BadRequestError(
      `Mã nhà máy id=${req.params.factoryId} không tồn tại`
    );

  const factoryDeleted = await deleteFactoryById(req.params.id);
  res.status(StatusCodes.OK).json({
    message: "Xoá nhà máy thành công",
    factory: factoryDeleted,
  });
}
