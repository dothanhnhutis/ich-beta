import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import { createDepartmentReq, UpdateDepartmentReq } from "@/schemas/department";
import {
  createDepartment,
  deleteDepartmentById,
  getDepartmentById,
  getDepartments,
  searchDepartment,
  updateDepartmentById,
} from "@/services/department";
import { getFactoryById } from "@/services/factory";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getDepartmentsHandler(req: Request, res: Response) {
  const isValidAccess = await hasPermission(req.user, "read:departments");
  if (!isValidAccess) throw new PermissionError();
  const departments = await getDepartments();
  res.status(StatusCodes.OK).json(departments);
}

export async function getDepartmentByIdHandler(
  req: Request<{ departmentId: string }>,
  res: Response
) {
  const isValidAccess = await hasPermission(req.user, "read:departments");
  if (!isValidAccess) throw new PermissionError();
  const departments = await getDepartmentById(req.params.departmentId);
  res.status(StatusCodes.OK).json(departments);
}

export async function createDepartmentHandler(
  req: Request<{}, {}, createDepartmentReq["body"]>,
  res: Response
) {
  const isValidAccess = await hasPermission(req.user, "write:departments");
  if (!isValidAccess) throw new PermissionError();

  const factoryId = await getFactoryById(req.body.factoryId);
  if (!factoryId)
    throw new BadRequestError(
      `Mã nhà máy id=${req.body.factoryId} không tồn tại.`
    );

  const departmentExists = await searchDepartment(req.body);
  if (departmentExists.pagination.totalItem > 0)
    throw new BadRequestError(`Tên phòng ban đã tồn tại.`);

  const department = await createDepartment(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "Tạo phòng ban thành công",
    department,
  });
}

export async function updateDepartmentHandler(
  req: Request<UpdateDepartmentReq["params"], {}, UpdateDepartmentReq["body"]>,
  res: Response
) {
  const isValidAccess = await hasPermission(req.user, "update:departments");
  if (!isValidAccess) throw new PermissionError();

  const department = await getDepartmentById(req.params.departmentId);
  if (!department)
    throw new BadRequestError(
      `Mã phòng ban id=${req.params.departmentId} không tồn tại.`
    );

  const factoryId = await getFactoryById(req.body.factoryId);
  if (!factoryId)
    throw new BadRequestError(
      `Mã nhà máy id=${req.body.factoryId} không tồn tại.`
    );

  const departmentExists = await searchDepartment(req.body);
  if (departmentExists.pagination.totalItem > 0)
    throw new BadRequestError(`Tên phòng ban đã tồn tại.`);

  const newDepartment = await updateDepartmentById(
    req.params.departmentId,
    req.body
  );

  res.status(StatusCodes.OK).json({
    message: "Cập nhật phòng ban thành công",
    department: newDepartment,
  });
}

export async function deleteDepartmentByIdHandler(
  req: Request<{ departmentId: string }>,
  res: Response
) {
  const isValidAccess = await hasPermission(req.user, "delete:departments");
  if (!isValidAccess) throw new PermissionError();

  const department = await getDepartmentById(req.params.departmentId);
  if (!department)
    throw new BadRequestError(
      `Mã phòng ban id=${req.params.departmentId} không tồn tại.`
    );
  const departmentDeleted = await deleteDepartmentById(req.params.departmentId);

  res.status(StatusCodes.OK).json({
    message: "Xoá phòng ban thành công",
    department: departmentDeleted,
  });
}
