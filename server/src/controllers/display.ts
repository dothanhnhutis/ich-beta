import { BadRequestError, PermissionError } from "@/error-handler";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import { CreateDisplayReq, UpdateDisplayByIdReq } from "@/schemas/display";
import { getDepartmentsInListService } from "@/services/department";
import {
  createDisplayService,
  createOrDeleteDisplaysService,
  deleteDisplayByIdService,
  getDisplayByIdService,
  getDisplaysService,
  updateDisplayService,
} from "@/services/display";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createDisplay(
  req: Request<{}, {}, CreateDisplayReq["body"]>,
  res: Response
) {
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  await createDisplayService({ ...req.body, userId: req.user!.id });
  return res.status(StatusCodes.CREATED).json({
    message: "create displays success",
  });
}

export async function updateDisplayById(
  req: Request<
    UpdateDisplayByIdReq["params"],
    {},
    UpdateDisplayByIdReq["body"]
  >,
  res: Response
) {
  const condition = req.condition;
  const display = await getDisplayByIdService(req.params.id);

  const { departmentIds, ...displaydata } = req.body;
  if (condition != null && !evaluateCondition(req.user!, condition, display))
    throw new PermissionError();

  if (!display) throw new BadRequestError("displayId không tồn tại");

  await updateDisplayService(req.params.id, {
    ...displaydata,
  });

  if (departmentIds) {
    let departments = [];
    if (departmentIds.length > 0)
      departments = await getDepartmentsInListService(departmentIds);
    if (departments.length != departmentIds.length)
      throw new BadRequestError("DepartmentId[?] không tồn tại.");
    await createOrDeleteDisplaysService(display.id, departmentIds);
  }

  return res.status(StatusCodes.CREATED).json({
    message: "Cập nhật displays thành công",
  });
}

export async function getDisplayById(
  req: Request<{ id: string }>,
  res: Response
) {
  const condition = req.condition;
  const display = await getDisplayByIdService(req.params.id);
  if (condition != null && !evaluateCondition(req.user!, condition, display))
    throw new PermissionError();

  if (!display) throw new BadRequestError("displayId không tồn tại");

  return res.status(StatusCodes.CREATED).json(display);
}

export async function getDisplays(req: Request, res: Response) {
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  const displays = await getDisplaysService();

  return res.status(StatusCodes.CREATED).json(displays);
}

export async function deleteDisplayById(
  req: Request<{ id: string }>,
  res: Response
) {
  const condition = req.condition;
  const display = await getDisplayByIdService(req.params.id);
  if (condition != null && !evaluateCondition(req.user!, condition, display))
    throw new PermissionError();

  if (!display) throw new BadRequestError("displayId không tồn tại");

  await deleteDisplayByIdService(req.params.id);

  return res.status(StatusCodes.CREATED).json(display);
}
