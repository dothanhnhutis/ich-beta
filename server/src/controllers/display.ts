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
import {
  createDisplaySocketSender,
  updateDisplaySocketSender,
} from "@/socket/display";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function createDisplay(
  req: Request<{}, {}, CreateDisplayReq["body"]>,
  res: Response
) {
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();

  if (req.body.departmentIds.length > 0) {
    const departments = await getDepartmentsInListService(
      req.body.departmentIds
    );
    if (departments.length != req.body.departmentIds.length)
      throw new BadRequestError("departmentIds[?] không tồn tại");
  }

  const display = await createDisplayService({
    ...req.body,
    userId: req.user!.id,
  });

  for (const id of req.body.departmentIds) {
    createDisplaySocketSender(id, display);
  }

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

  const newDisplay = await updateDisplayService(req.params.id, {
    ...displaydata,
  });

  if (departmentIds) {
    let departments = [];
    if (departmentIds.length > 0)
      departments = await getDepartmentsInListService(departmentIds);
    if (departments.length != departmentIds.length)
      throw new BadRequestError("DepartmentId[?] không tồn tại.");
    await createOrDeleteDisplaysService(display.id, departmentIds);
    updateDisplaySocketSender(departmentIds, newDisplay);
  }

  return res.status(StatusCodes.OK).json({
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
