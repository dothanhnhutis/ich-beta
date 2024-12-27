import { BadRequestError, PermissionError } from "@/error-handler";
import { hasPermission } from "@/middlewares/checkPermission";
import {
  readDepartmentById,
  getDepartmentsService,
  getDisplaysOfDepartmentService,
} from "@/services/department";
import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export async function getDepartments(req: Request, res: Response) {
  const isValidAccess = hasPermission(req.user, "read:departments");
  if (!isValidAccess) throw new PermissionError();

  const departments = await getDepartmentsService();
  res.status(StatusCodes.OK).send(departments);
}

export async function getDisplaysOfDepartment(
  req: Request<{ id: string }>,
  res: Response
) {
  const isValidAccess = hasPermission(req.user, "read:departments");
  if (!isValidAccess) throw new PermissionError();

  const department = await readDepartmentById(req.params.id);
  if (!department) throw new BadRequestError("department không tồn tại");

  const displays = await getDisplaysOfDepartmentService(req.params.id);
  res.status(StatusCodes.OK).send(displays);
}
