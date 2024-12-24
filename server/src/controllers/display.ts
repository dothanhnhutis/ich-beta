import { BadRequestError, PermissionError } from "@/error-handler";
import { evaluateCondition } from "@/middlewares/checkpolicy";
import {
  CreateDisplayReq,
  queryDisplaysSchema,
  UpdateDisplayByIdReq,
} from "@/schemas/display";
import { getDepartmentsInListService } from "@/services/department";
import {
  createDisplayService,
  createOrDeleteDisplaysService,
  deleteDisplayByIdService,
  getDisplayByIdService,
  QueryDisplay,
  queryDisplaysService,
  updateDisplayService,
} from "@/services/display";
import {
  createDisplaySocketSender,
  deleteDisplaySocketSender,
  updateDisplaySocketSender,
} from "@/socket/display";
import { create } from "domain";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

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

  if (req.body.enable) {
    createDisplaySocketSender(req.body.departmentIds, display);
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

  if (departmentIds) {
    let departments = [];
    if (departmentIds.length > 0)
      departments = await getDepartmentsInListService(departmentIds);
    if (departments.length != departmentIds.length)
      throw new BadRequestError("DepartmentId[?] không tồn tại.");
    await createOrDeleteDisplaysService(display.id, departmentIds);
  }
  const newDisplay = await updateDisplayService(req.params.id, {
    ...displaydata,
  });
  console.log(newDisplay);
  const senToDepartments = display.departments
    .map((d) => d.id)
    .concat(departmentIds || [])
    .filter((value, index, array) => array.indexOf(value) === index);
  updateDisplaySocketSender(senToDepartments, newDisplay);

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

  return res.status(StatusCodes.OK).json(display);
}

export async function getDisplays(req: Request, res: Response) {
  const condition = req.condition;
  if (condition != null && !evaluateCondition(req.user!, condition))
    throw new PermissionError();
  const { success, data } = queryDisplaysSchema.safeParse(req.query);

  let query: QueryDisplay = {};
  if (data) {
    const {
      priority,
      enable,
      createdAt,
      maxPriority,
      minPriority,
      createdAtFrom,
      createdAtTo,
      orderBy,
      ...props
    } = data;

    query = {
      ...props,
    };

    if (priority != undefined) {
      query.priority = priority;
    } else if (
      minPriority != undefined &&
      maxPriority != undefined &&
      maxPriority >= minPriority
    ) {
      query.priority = [minPriority, maxPriority];
    }

    if (enable != undefined) {
      query.enable = enable;
    }

    if (createdAt != undefined) {
      query.createdAt = createdAt;
    } else if (
      createdAtFrom != undefined &&
      createdAtTo != undefined &&
      new Date(createdAtTo).getTime() >= new Date(createdAtFrom).getTime()
    ) {
      query.createdAt = [createdAtFrom, createdAtTo];
    }
    if (orderBy) {
      query.orderBy = orderBy as QueryDisplay["orderBy"];
    }
  }
  console.log(query);
  const displays = await queryDisplaysService(query);
  return res.status(StatusCodes.OK).json(displays);
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

  return res.status(StatusCodes.OK).json(display);
}
