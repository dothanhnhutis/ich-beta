import { BadRequestError, PermissionError } from "@/error-handler";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import {
  getDepartmentByIdService,
  getDepartmentsService,
  getDisplaysOfDepartmentService,
} from "@/services/department";
import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export async function getDepartments(req: Request, res: Response) {
  const departments = await getDepartmentsService();
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  return res.status(StatusCodes.OK).send(departments);
}

export async function getDisplaysOfDepartment(
  req: Request<{ id: string }>,
  res: Response
) {
  const condition = req.condition;
  const department = await getDepartmentByIdService(req.params.id);

  if (condition != null && !evaluateCondition(req.user!, condition, department))
    throw new PermissionError();

  if (!department) throw new BadRequestError("departmentId không tồn tại");

  const displays = await getDisplaysOfDepartmentService(req.params.id);

  return res.status(StatusCodes.OK).send(displays);
}
